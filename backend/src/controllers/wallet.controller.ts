import type { Request, Response,} from 'express';
import { WalletService } from '../services/wallet.service';
import { asyncHandler } from '../utils/asyncHandler'; // Pastikan path benar

export class WalletController {
  private walletService: WalletService;

  constructor() {
    this.walletService = new WalletService();
  }

  // Bungkus dengan asyncHandler agar error otomatis dilempar ke NextFunction
  public index = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id; // Menggunakan Custom Request Type kamu
    const wallets = await this.walletService.getWallets(userId!);
    
    res.status(200).json({ 
      success: true, 
      message: "Operation success", 
      data: wallets 
    });
  });

  public create = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const wallet = await this.walletService.createWallet(userId!, req.body);
    
    res.status(201).json({ 
      success: true, 
      message: "Operation success", 
      data: wallet 
    });
  });

  public update = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const { id } = req.params;
    const wallet = await this.walletService.updateWallet(userId!, id!, req.body);
    
    res.status(200).json({ 
      success: true, 
      message: "Operation success", 
      data: wallet 
    });
  });

  public delete = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const { id } = req.params;
    await this.walletService.deleteWallet(userId!, id!);
    
    res.status(200).json({ 
      success: true, 
      message: "Operation success", 
      data: {} 
    });
  });
}