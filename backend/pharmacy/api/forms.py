from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User
from .models import Users

class RegisterForm(UserCreationForm):
    phone_number = forms.CharField(max_length=20, required=False)
    current_address = forms.CharField(max_length=200, required=False)
    province = forms.CharField(max_length=50, required=False)
    city = forms.CharField(max_length=50, required=False)
    avatar_url = forms.CharField(max_length=200, required=False)
    preferred_theme = forms.CharField(max_length=20, required=False)
    role = forms.CharField(max_length=50, required=False)
    birth_date = forms.DateField(required=False, widget=forms.DateInput(attrs={'type': 'date'}))

    class Meta:
        model = User
        fields = [
            'username', 'email', 'first_name', 'last_name',
            'password1', 'password2',
            'phone_number', 'current_address', 'province', 'city',
            'avatar_url', 'preferred_theme', 'role', 'birth_date'
        ]

    def save(self, commit=True):
        user = super().save(commit=False)
        if commit:
            user.save()
            Users.objects.create(
                user=user,
                phone_number=self.cleaned_data.get('phone_number'),
                current_address=self.cleaned_data.get('current_address'),
                province=self.cleaned_data.get('province'),
                city=self.cleaned_data.get('city'),
                avatar_url=self.cleaned_data.get('avatar_url'),
                preferred_theme=self.cleaned_data.get('preferred_theme'),
                role=self.cleaned_data.get('role'),
                birth_date=self.cleaned_data.get('birth_date'),
            )
        return user
