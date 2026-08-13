import { Referral, ReferralStatus, ReferralActivity, ReferralActivityType } from '../../types/referral';
import { v4 as uuidv4 } from 'uuid';

/**
 * Defines the valid state transitions for a Referral.
 * Key: Current Status, Value: Array of allowed Next Statuses.
 */
const VALID_TRANSITIONS: Record<ReferralStatus, ReferralStatus[]> = {
  'DRAFT': ['PENDING', 'CANCELLED'],
  'PENDING': ['UNDER_REVIEW', 'CANCELLED'],
  'UNDER_REVIEW': ['ACCEPTED', 'DECLINED', 'CANCELLED'],
  'ACCEPTED': ['COMPLETED', 'CANCELLED'],
  'DECLINED': [], // Terminal
  'CANCELLED': [], // Terminal
  'COMPLETED': [] // Terminal
};

export class InvalidReferralTransitionError extends Error {
  constructor(current: ReferralStatus, attempted: ReferralStatus) {
    super(`Invalid transition: Cannot move referral from ${current} to ${attempted}.`);
    this.name = 'InvalidReferralTransitionError';
  }
}

/**
 * Safely transitions a referral to a new status.
 * Throws InvalidReferralTransitionError if the transition is not permitted.
 */
export function transitionReferral(
  referral: Referral, 
  newStatus: ReferralStatus, 
  actorId: string, 
  actorRole: 'REFERRER' | 'HOSPITAL_STAFF' | 'SYSTEM',
  description: string
): { updatedReferral: Referral, auditEvent: ReferralActivity } {
  
  if (!VALID_TRANSITIONS[referral.status].includes(newStatus)) {
    throw new InvalidReferralTransitionError(referral.status, newStatus);
  }

  const updatedReferral: Referral = {
    ...referral,
    status: newStatus,
    updatedAt: new Date().toISOString()
  };

  const activityTypeMap: Record<ReferralStatus, ReferralActivityType> = {
    'DRAFT': 'REFERRAL_CREATED', // Conceptually, creating the draft
    'PENDING': 'REFERRAL_CREATED',
    'UNDER_REVIEW': 'REVIEW_STARTED',
    'ACCEPTED': 'ACCEPTED',
    'DECLINED': 'DECLINED',
    'CANCELLED': 'CANCELLED',
    'COMPLETED': 'JOURNEY_COMPLETED'
  };

  const auditEvent: ReferralActivity = {
    id: uuidv4(),
    referralId: referral.id,
    type: activityTypeMap[newStatus],
    description,
    timestamp: updatedReferral.updatedAt,
    actorId: {
      id: actorId,
      role: actorRole
    }
  };

  return { updatedReferral, auditEvent };
}
