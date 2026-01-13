import type { Request, Response } from 'express';
import { WalletService } from '../services/wallet.service';
import { asyncHandler } from '../utils/asyncHandler';


export class WalletController {
  private walletService: WalletService;

  constructor() {
    this.walletService = new WalletService
  }

  public index = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new Error("Unauthorized");

    const wallets = await this.walletService.getWallets(userId);

    res.status(200).json({
      success: true,
      message: "Operation success",
      data: wallets
    });
  });

  public create = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id
    if (!userId) throw new Error("Unauthorized");

    const wallet = await this.walletService.createWallet(userId, req.body)


    res.status(201).json({
      success: true,
      message: "Operation success",
      data: wallet
    });
  });

  public update = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new Error("Unatuhorized");

    const { id } = req.params;

    const wallet = await this.walletService.updateWallet(userId!, id!, req.body)
  res.status(200).json({ 
      success: true, 
      message: "Operation success", 
      data: wallet 
    });
  });
  
public delete = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new Error("Unauthorized"); // Validasi

    const { id } = req.params;
    await this.walletService.deleteWallet(userId, id!);
    
    res.status(200).json({ 
      success: true, 
      message: "Operation success", 
      data: {} 
    });
  });

}