import {
  IsString,
  IsNumber,
  IsIn,
  IsNotEmpty,
  IsCreditCard,
  IsDefined,
  ValidateNested,
  IsOptional,
} from 'class-validator';
type PreferredNetwork = 'cartes_bancaires' | 'mastercard' | 'visa';
class CardNetworksDto {
  /**
   * The customer's preferred card network for co-branded cards. Supports `cartes_bancaires`, `mastercard`, or `visa`.
   * Selection of a network that does not apply to the card will be stored as `invalid_preference` on the card.
   */
  @IsIn(['cartes_bancaires', 'mastercard', 'visa'], {
    message:
      'Preferred network must be either cartes_bancaires, mastercard, or visa',
  })
  preferred: PreferredNetwork;
}

export class CardDto {
  /**
   * The card's CVC. It is highly recommended to always include this value.
   */
  @IsString()
  @IsNotEmpty()
  cvc: string;

  /**
   * Two-digit number representing the card's expiration month.
   */
  @IsNumber({}, { message: 'Expiration month must be a number' })
  exp_month: number;

  /**
   * Four-digit number representing the card's expiration year.
   */
  @IsNumber({}, { message: 'Expiration year must be a number' })
  exp_year: number;

  /**
   * Contains information about card networks used to process the payment.
   */
  @IsDefined()
  @ValidateNested()
  @IsOptional()
  networks?: CardNetworksDto;

  /**
   * The card number, as a string without any separators.
   */

  @IsCreditCard()
  number: string;

  /**
   * For backwards compatibility, you can alternatively provide a Stripe token (e.g., for Apple Pay, Amex Express Checkout, or legacy Checkout) into the card hash with format card: {token: "tok_visa"}.
   */
  @IsString()
  @IsOptional()
  token?: string;
}
