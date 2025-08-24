// Authentication status utility
export const checkAuthStatus = () => {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  
  return {
    isAuthenticated: !!token,
    token: token,
    user: user ? JSON.parse(user) : null,
    tokenExists: !!token,
    userExists: !!user
  };
};

export const logAuthStatus = () => {
  const status = checkAuthStatus();
  console.group('🔐 Authentication Status Check');
  console.log('✅ Token exists:', status.tokenExists);
  console.log('✅ User data exists:', status.userExists);
  console.log('✅ Is authenticated:', status.isAuthenticated);
  if (status.user) {
    console.log('👤 User info:', {
      name: status.user.name,
      email: status.user.email,
      role: status.user.role
    });
  }
  console.groupEnd();
  return status;
};

export default { checkAuthStatus, logAuthStatus };
