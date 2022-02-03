import Voter from '../models/Voter';
import Vote from '../models/Vote';
import TotalVotes from '../models/TotalVotes';
import { ethers } from "ethers";

export default class ContractAdapter{
  
  static adaptVoter(obj: any):Voter{
    let voter = new Voter(
      obj.voterAddress,
      obj.totalVotes.toNumber(),
      ContractAdapter.getDate(obj.firstVote.toNumber()),
      ContractAdapter.getDate(obj.latestVote.toNumber()),
      obj.votes.map (n => n.toNumber())
    );
    return voter;
  }
  static adaptTotalVotes(obj: any): TotalVotes{
    let totalVotes: TotalVotes = new TotalVotes(
      obj.votesByCandidate.map(n => n.toNumber()),
      obj.totalVotes.toNumber()
    );
    return totalVotes;
  }
  static adaptAllVotes(obj: any): Vote[]{
    console.table(obj);
    let allVotes: Vote[] = obj.map(v => ContractAdapter.adaptVote(v));
    return allVotes;
  }
  static adaptVote(obj:any): Vote{
    let v: Vote=new Vote(
       obj.voterAddress,
       obj.message,
       ContractAdapter.getDate(obj.timestamp.toNumber()),
       obj.candidateId.toNumber()
    );
    return v;

  }
  static getDate(timestamp: number):Date {
    let date: Date = new Date(timestamp);
    return date;
  }
}