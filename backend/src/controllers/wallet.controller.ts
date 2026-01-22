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
    const userId = req.user?.id;

    if (process.env.NODE_ENV === 'development') {
      console.log('[wallet] create called from', req.ip || req.hostname, 'userId:', userId, 'body:', req.body);
    }

    const wallet = await this.walletService.createWallet(userId!, req.body);

    if (process.env.NODE_ENV === 'development') {
      try {
        console.log(`[wallet] created id=${(wallet as any).id} name=${(wallet as any).name} userId=${userId}`);
      } catch (_) { }
    }

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

    if (process.env.NODE_ENV === 'development') {
      console.log('[wallet] update called from', req.ip || req.hostname, 'userId:', userId, 'walletId:', id, 'body:', req.body);
    }

    const wallet = await this.walletService.updateWallet(userId!, id!, req.body);

    if (process.env.NODE_ENV === 'development') {
      try {
        console.log(`[wallet] updated id=${(wallet as any).id} name=${(wallet as any).name} userId=${userId}`);
      } catch (_) { }
    }

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

    if (process.env.NODE_ENV === 'development') {
      console.log('[wallet] delete called from', req.ip || req.hostname, 'userId:', userId, 'walletId:', id);
    }

    await this.walletService.deleteWallet(userId!, id!);

    if (process.env.NODE_ENV === 'development') {
      console.log(`[wallet] deleted id=${id} by userId=${userId}`);
    }

    res.status(200).json({
      success: true,
      message: "Operation success",
      data: {}
    });
  });

}