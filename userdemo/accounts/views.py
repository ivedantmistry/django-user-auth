from django.shortcuts import render, redirect
from django.contrib.auth import login, logout, authenticate
from .forms import CustomUserCreationForm
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from .models import CustomUser

# Sign-up view
def signup_view(request):
    if request.user.is_authenticated:
        return redirect('dashboard')
    
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')

        if CustomUser.objects.filter(username=username).exists():
            messages.error(request, 'Username already exists.')
            return render(request, 'signup.html')

        user = CustomUser.objects.create_user(username=username, password=password)
        user.save()

        login(request, user)
        return redirect('dashboard')

    return render(request, 'signup.html')

# Login view
def login_view(request):
    if request.user.is_authenticated:
        return redirect('dashboard')
    
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        print("Login POST received. Username:", username, "Password:", password)

        # Authenticate user
        user = authenticate(request, username=username, password=password)

        if user is not None:
            print("Authentication successful for", user.username)
            login(request, user)
            return redirect('dashboard')  # Redirect to dashboard on successful login
        else:
            print("Authentication failed.")
            messages.error(request, 'Invalid username or password.')

    return render(request, 'login.html')

# Logout view
def logout_view(request):
    logout(request)  # Logs out the user and clears session data
    return redirect('login')  # Redirects to login page after logout

# Dashboard view
@login_required(login_url='/login/')
def dashboard_view(request):
    print("User authenticated:", request.user.is_authenticated)
    print("User:", request.user)

    # Handle updating phone number
    if request.method == 'POST':
        phone = request.POST.get('phone_number')
        if phone:
            request.user.phone_number = phone
            request.user.save()
            messages.success(request, "Phone number updated!")

    return render(request, 'dashboard.html', {'user': request.user})
