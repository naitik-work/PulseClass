/**
 * Generate a short unique institute join code.
 * Format: PC + 4 alphanumeric chars (e.g., PC7A9B)
 * If collision, caller should retry.
 */
function generateInstituteCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // No I/O/0/1 to avoid confusion
  let code = 'PC';
  for (let i = 0; i < 4; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

/**
 * Calculate response distribution for a poll (aggregate, never per-student)
 */
function calculateDistribution(poll, responses) {
  const distribution = {};

  if (poll.responseType === 'yesno') {
    distribution['Yes'] = 0;
    distribution['No'] = 0;
  } else if (poll.responseType === 'rating') {
    for (let i = 1; i <= 5; i++) {
      distribution[String(i)] = 0;
    }
  } else if (poll.responseType === 'choice') {
    (poll.options || []).forEach((opt) => {
      distribution[opt] = 0;
    });
  }

  (responses || []).forEach((r) => {
    if (Object.prototype.hasOwnProperty.call(distribution, r.answer)) {
      distribution[r.answer]++;
    }
  });

  return distribution;
}

module.exports = { generateInstituteCode, calculateDistribution };
