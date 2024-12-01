from rest_framework.views import APIView
from rest_framework.decorators import api_view
from rest_framework import generics
from rest_framework.response import Response
from rest_framework import status, serializers
from .serializers import RegisterSerializer, UpdateUserSerializer, UserSerializer
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from .models import CustomUser


class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(
            {"mensaje": "Usuario creado exitosamente"},
            status=status.HTTP_201_CREATED,
            headers=headers,
        )


class UpdateProfileView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]  # Permite subir imágenes

    def put(self, request):
        user = request.user
        serializer = UserSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CurrentUserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user, context={"request": request})
        return Response(serializer.data)


class UpdateCurrentUserView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request):
        user = request.user
        serializer = UpdateUserSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ChangePasswordWithoutCurrentView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request):
        user = request.user
        new_password = request.data.get("new_password")

        if not new_password:
            return Response(
                {"error": "Se requiere una nueva contraseña"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user.set_password(new_password)
        user.save()
        return Response(
            {"message": "Contraseña cambiada con éxito"}, status=status.HTTP_200_OK
        )


@api_view(["GET"])
def check_username(request):
    username = request.query_params.get("username")
    if not username:
        return Response(
            {"error": "El nombre de usuario es obligatorio."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    serializer = RegisterSerializer()
    try:
        serializer.validate_username(username)
        return Response(
            {"exists": False}, status=status.HTTP_200_OK
        )  # No existe el username
    except serializers.ValidationError as e:
        return Response(
            {"exists": True, "message": str(e.detail[0])}, status=status.HTTP_200_OK
        )


@api_view(["GET"])
def check_email(request):
    email = request.query_params.get("email")  # Leer el parámetro `email` de la URL
    if not email:
        return Response(
            {"error": "El correo electrónico es obligatorio."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    serializer = RegisterSerializer()
    try:
        serializer.validate_email(email)
        return Response(
            {"exists": False}, status=status.HTTP_200_OK
        )  # No existe el email
    except serializers.ValidationError as e:
        return Response(
            {"exists": True, "message": str(e.detail[0])}, status=status.HTTP_200_OK
        )
