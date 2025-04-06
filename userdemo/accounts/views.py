import random
from django.shortcuts import render, redirect
from django.contrib import messages
from django.contrib.auth import authenticate, login as auth_login, logout
from django.contrib.auth.decorators import login_required
from django.core.mail import send_mail
from django.conf import settings
from .models import CustomUser
from django.contrib.auth import logout as auth_logout

def generate_otp():
    return str(random.randint(100000, 999999))


def signup(request):
    if request.user.is_authenticated:
        return redirect("profile")
    if request.method == "POST":
        email = request.POST["email"]
        password = request.POST["password"]

        if CustomUser.objects.filter(email=email).exists():
            messages.error(request, "Email already exists")
            return redirect("signup")

        otp = generate_otp()
        request.session["pending_user"] = {
            "email": email,
            "password": password,
            "otp": otp
        }

        send_mail(
            "Your OTP Code",
            f"Your OTP code is {otp}",
            settings.EMAIL_HOST_USER,
            [email],
            fail_silently=False,
        )

        return redirect("verify_otp")

    return render(request, "signup.html")


def verify_otp(request):
    if request.user.is_authenticated:
        return redirect("profile")
    session_data = request.session.get("pending_user")

    if not session_data:
        messages.error(request, "Invalid request. Please sign up again.")
        return redirect("signup")

    if request.method == "POST":
        input_otp = request.POST.get("otp")

        if input_otp == session_data["otp"]:
            email = session_data["email"]
            password = session_data["password"]

            user = CustomUser.objects.create_user(email=email, password=password)
            user.is_active = True
            user.email_verified = True
            user.save()

            # Clear session
            del request.session["pending_user"]

            messages.success(request, "Email verified successfully! You can now log in.")
            return redirect("login")
        else:
            messages.error(request, "Invalid OTP. Please try again.")
            return redirect("verify_otp")

    return render(request, "verify_otp.html")



def login_view(request):
    if request.user.is_authenticated:
        return redirect("profile")
    if request.method == "POST":
        email = request.POST["email"]
        password = request.POST["password"]

        user = authenticate(request, email=email, password=password)

        if user is not None:
            if user.email_verified:
                auth_login(request, user)
                return redirect("profile")
            else:
                messages.error(request, "Please verify your email first.")
                return redirect("login")
        else:
            messages.error(request, "Invalid credentials.")
            return redirect("login")

    return render(request, "login.html")

def logout_view(request):
    auth_logout(request)
    messages.success(request, "You have been logged out.")
    return redirect("login")


@login_required(login_url="/login/")
def profile(request):
    if request.method == "POST":
        user = request.user
        user.first_name = request.POST.get("first_name", "")
        user.last_name = request.POST.get("last_name", "")
        user.phone_number = request.POST.get("phone_number", "")
        user.save()
        messages.success(request, "Profile updated successfully.")

    return render(request, "profile.html", {"user": request.user})
