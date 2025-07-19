import React from 'react';

const PasswordStrengthIndicator = ({ password }: { password: string }) => {
  const getPasswordStrength = (password: string) => {
    let score = 0;
    if (!password) return score;

    // Add points for length
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;

    // Add points for character types
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    return Math.min(score, 5); // Cap the score at 5
  };

  const strength = getPasswordStrength(password);
  const strengthLabels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
  const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500'];

  return (
    <div className="mt-2">
      <div className="flex items-center">
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className={`${strengthColors[strength -1] || ''} h-2.5 rounded-full`}
            style={{ width: `${(strength / 5) * 100}%` }}
          ></div>
        </div>
        <span className="ml-3 text-sm font-medium text-gray-700">{strength > 0 ? strengthLabels[strength - 1] : ''}</span>
      </div>
    </div>
  );
};

export default PasswordStrengthIndicator;