
import { Position, Scheme, DefenseScheme } from './types';

export const FIRST_NAMES = [
  'Jalen', 'Marcus', 'Caleb', 'Tyler', 'Noah', 'Elijah', 'DeAndre', 'Jackson', 'Xavier', 'Mason',
  'Ethan', 'Aiden', 'Jayden', 'Liam', 'Jordan', 'Bryce', 'Cam', 'Desmond', 'Malik', 'Trevor'
];

export const LAST_NAMES = [
  'Williams', 'Johnson', 'Smith', 'Jackson', 'Davis', 'Brown', 'Miller', 'Wilson', 'Moore', 'Taylor',
  'Anderson', 'Thomas', 'White', 'Harris', 'Martin', 'Thompson', 'Garcia', 'Martinez', 'Robinson', 'Clark'
];

export const SCHOOL_NAMES = [
  'Central High', 'Oak Ridge', 'Valley View', 'St. Jude Prep', 'Riverside', 'East Side', 'Mountain View',
  'Lincoln Park', 'Northwood', 'South Creek', 'Heritage', 'Unity', 'Liberty', 'Summit', 'Pine Crest'
];

export const MASCOTS = [
  'Eagles', 'Tigers', 'Lions', 'Panthers', 'Bulldogs', 'Wildcats', 'Warriors', 'Knights', 'Cougars', 'Rams'
];

export const POSITION_REQUIREMENTS = {
  [Position.QB]: 1,
  [Position.RB]: 2,
  [Position.WR]: 3,
  [Position.TE]: 1,
  [Position.OL]: 5,
  [Position.DL]: 4,
  [Position.LB]: 3,
  [Position.DB]: 4,
  [Position.K]: 1,
};
