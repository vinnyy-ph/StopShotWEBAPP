from rest_framework import permissions

class IsOwnerOrAdmin(permissions.BasePermission):
    """
    Custom permission to only allow owners of an object or admins to edit/delete it.
    Assumes the user model has an 'is_admin_level' property or similar check.
    """
    def has_object_permission(self, request, view, obj):
  
        if not request.user or not request.user.is_authenticated:
            return False

        if request.user.is_staff:
            return True
 
        return obj.user == request.user 