import type { CaseFile } from '../../domain/caseFile';
import { galaBlackout } from './galaBlackout';
import { mansionWatch } from './mansionWatch';
import { museumTheft } from './museumTheft';
import { poisonedDinner } from './poisonedDinner';
import { theaterSabotage } from './theaterSabotage';

export const allCases: readonly CaseFile[] = [mansionWatch, poisonedDinner, museumTheft, galaBlackout, theaterSabotage];
