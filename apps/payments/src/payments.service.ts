import { ConfigService } from '@nestjs/config';
import { Inject, Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { NOTIFICATIONS_SERVICE } from '@app/common';
import { ClientProxy } from '@nestjs/microservices';
import { PaymentsCreateChargeDto } from './dto/payment-create-charge.dto';

@Injectable()
export class PaymentsService {
  constructor(
    private readonly configService: ConfigService,
    @Inject(NOTIFICATIONS_SERVICE)
    private readonly notificationsService: ClientProxy,
  ) {}
  private readonly stripe = new Stripe(
    this.configService.get('STRIPE_SECRET_KEY'),
    {
      apiVersion: '2024-09-30.acacia',
    },
  );
  async createCharge({ amount, email }: PaymentsCreateChargeDto) {
    const paymentMethod = await this.stripe.paymentMethods.create({
      type: 'card',
      card: { token: 'tok_visa' },
    });
    const paymentIntent = await this.stripe.paymentIntents.create({
      payment_method: paymentMethod.id,
      amount: amount * 100, // Stripe expects amount in cents
      confirm: true,
      payment_method_types: ['card'],
      currency: 'usd',
    });
    // const paymentIntent = await this.stripe.paymentIntents.create({
    //   amount: amount * 100,
    //   confirm: true,
    //   currency: 'usd',
    //   payment_method: 'pm_card_visa',
    //   automatic_payment_methods: {
    //     enabled: true,
    //     allow_redirects: 'never',
    //   },
    // });
    this.notificationsService.emit('notify_email', {
      email,
      text: `Your payment of $${amount} has completed successfully.`,
    });
    return paymentIntent;
  }
}
