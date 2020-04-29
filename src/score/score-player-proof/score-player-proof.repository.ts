import { EntityRepository, Repository } from 'typeorm';
import { ScorePlayerProof } from './score-player-proof.entity';

@EntityRepository(ScorePlayerProof)
export class ScorePlayerProofRepository extends Repository<ScorePlayerProof> {}
