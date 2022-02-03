import { ethers } from "ethers";
import Voter from '../models/Voter';
import Vote from '../models/Vote';
import TotalVotes from '../models/TotalVotes';

import ContractAdapter from '../adapters/ContractAdapter';

export default class ContractController{
  static wavePortalContract;

  static Initialize(ethereum, contractAddress, contractABI){
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    ContractController.wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);


  }
  static async vote(candidateId: number, comment: string):Promise<Voter>{
    let timestamp: number = ContractController.getTime();
    let trx: any = await ContractController.wavePortalContract.vote(timestamp,candidateId, comment,{ gasLimit: 300000 });
    return trx;
  }
  static async getTotalVotes(): Promise<TotalVotes>{
    let obj: any = await ContractController.wavePortalContract.getTotalVotes();
    let totalVotes: TotalVotes = ContractAdapter.adaptTotalVotes(obj);
    return totalVotes;

  }
  static async getAllVotes(): Promise<Vote[]>{
    let obj: any = await ContractController.wavePortalContract.getAllVotes();
    let allVotes: Vote[] = ContractAdapter.adaptAllVotes(obj);
    console.log('getAllVotes see allVotes below');
    console.table(allVotes);
    return allVotes;

  }
  static async getVoter(): Promise<Voter>{
    let obj:any = await ContractController.wavePortalContract.getVoter();
    let voter: Voter = ContractAdapter.adaptVoter(obj);
    return voter;
  }
static getTime():number {
    let date = (new Date()).getTime();
        console.log('getTime timestamp: %s',date);
    return date;
  }
}