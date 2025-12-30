
import { AttackerStats, AnalysisResult } from '../types';

const SSH_FAILED_REGEX = /([A-Z][a-z]{2}\s+\d+\s\d{2}:\d{2}:\d{2}).*Failed password for (?:invalid user )?(\S+) from (\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})/i;
const SSH_SUCCESS_REGEX = /([A-Z][a-z]{2}\s+\d+\s\d{2}:\d{2}:\d{2}).*Accepted password for (\S+) from (\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})/i;

const MOCK_GEO: Record<string, { country: string; code: string }> = {
  '192.': { country: 'Local Network', code: 'UN' },
  '45.': { country: 'Russian Federation', code: 'RU' },
  '103.': { country: 'China', code: 'CN' },
  '185.': { country: 'Netherlands', code: 'NL' },
};

const getGeo = (ip: string) => {
  const prefix = ip.split('.').slice(0, 1).join('.') + '.';
  return MOCK_GEO[prefix] || { country: 'Unknown Origin', code: 'UN' };
};

export const cleanLog = (content: string): string => {
  const lines = content.split('\n');
  return lines.filter(line => SSH_FAILED_REGEX.test(line) || SSH_SUCCESS_REGEX.test(line)).join('\n');
};

export const parseAuthLog = (content: string): AnalysisResult => {
  const lines = content.split('\n');
  const attackerMap = new Map<string, AttackerStats>();
  let totalFailed = 0;
  let breachesDetected = 0;

  for (const line of lines) {
    let match = line.match(SSH_FAILED_REGEX);
    let isSuccess = false;
    if (!match) {
      match = line.match(SSH_SUCCESS_REGEX);
      isSuccess = !!match;
    }

    if (match) {
      const [_, ts, user, ip] = match;
      if (!isSuccess) totalFailed++;

      const stats = attackerMap.get(ip) || {
        ip, failedAttempts: 0, usersTargeted: [], firstSeen: ts, lastSeen: ts,
        score: 0, severity: 'Low', severityExplanation: '', successfulLoginDetected: false,
        verdict: 'Under Investigation', ...getGeo(ip)
      };

      if (!isSuccess) {
        stats.failedAttempts++;
        if (!stats.usersTargeted.includes(user)) stats.usersTargeted.push(user);
        stats.lastSeen = ts;
      } else {
        // Corrected logic: only count breach if they tried and failed first (brute force indicator)
        if (stats.failedAttempts >= 3) {
          stats.successfulLoginDetected = true;
          breachesDetected++;
        }
      }
      attackerMap.set(ip, stats);
    }
  }

  const attackers = Array.from(attackerMap.values())
    .filter(a => a.failedAttempts >= 3 || a.successfulLoginDetected)
    .map(a => {
      // DEBUGGING FIX: Strictly enforce TP for breaches
      if (a.successfulLoginDetected) {
        a.verdict = 'True Positive - Confirmed Compromise';
        a.severity = 'Critical';
        a.score = 100;
      } else if (a.failedAttempts > 20) {
        a.verdict = 'True Positive - Attack Attempt';
        a.severity = 'High';
        a.score = Math.min(95, a.failedAttempts * 2);
      } else {
        a.verdict = 'Under Investigation';
        a.severity = 'Medium';
        a.score = 40;
      }
      return a;
    })
    .sort((a, b) => b.score - a.score);

  return {
    attackers,
    totalFailedAttempts: totalFailed,
    totalSuccessfulLogins: breachesDetected,
    stats: {
      rootTargeted: attackers.some(a => a.usersTargeted.includes('root')),
      peakHour: 0,
      uniqueIPs: attackerMap.size,
      breachesDetected,
      systemCompromised: breachesDetected > 0
    }
  };
};
