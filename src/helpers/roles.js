// This file contains helper functions for converting and checking user roles

// Convert desired role name from frontend ("expert", "seller") to database format
function desiredRoleToDbRole(desiredRole) {
  const normalized = String(desiredRole || '').trim().toLowerCase();
  if (normalized === 'expert') {
    return 'Verified Expert'; // Database stores it as "Verified Expert"
  }
  if (normalized === 'seller') {
    return 'General Vendor'; // Database stores it as "General Vendor"
  }
  return null; // Unknown role
}

// Similar to above but also handles admin role conversions
function desiredAdminRoleToDbRole(desiredRole) {
  const normalized = String(desiredRole || '').trim().toLowerCase();
  if (normalized === 'farmer') {
    return 'Farmer'; // Admin can assign Farmer role
  }
  // For other roles, use the normal conversion
  return desiredRoleToDbRole(normalized);
}

// Check if a user is a Verified Expert
function isExpertRole(role) {
  return role === 'Verified Expert';
}

module.exports = {
  desiredRoleToDbRole,
  desiredAdminRoleToDbRole,
  isExpertRole,
};
