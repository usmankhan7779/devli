import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PricingService {

  free_plan = {
    name: 'Free Account',
    price: 0.00,
    duration_key: 'free_account',
    duration_label: 'free',
    saving_label: null,
    type: 'Free',
    plan_full_dd: 'Free Account',
    stripe_id: ''
  };

  bettingPlanOptions = {
    three_day_premium: {
      name: 'Betting Premium',
      stripe_id: 'BettingPremium-4',
      price: 49.99,
      duration_key: 'three_days',
      duration_label: '3 days',
      saving_label: null
    },
    three_day_sharp: {
      name: 'Betting Sharp',
      stripe_id: 'BettingSharp-4',
      price: 69.99,
      duration_key: 'three_days',
      duration_label: '3 days',
      saving_label: null
    },
    monthly_premium: {
      name: 'Betting Premium',
      stripe_id: 'BettingPremium-1',
      price: 199.00,
      duration_key: 'monthly',
      duration_label: 'month',
      saving_label: null
    },
    monthly_sharp: {
      name: 'Betting Sharp',
      stripe_id: 'BettingSharp-1',
      price: 299.00,
      duration_key: 'monthly',
      duration_label: 'month',
      saving_label: null
    },
    six_month_premium: {
      name: 'Betting Premium',
      stripe_id: 'BettingPremium-2',
      price: 999.99,
      duration_key: 'six_months',
      duration_label: '6 months',
      saving_label: 'Save $194 (16% off)'
    },
    six_month_sharp: {
      name: 'Betting Sharp',
      stripe_id: 'BettingSharp-2',
      price: 1499.99,
      duration_key: 'six_months',
      duration_label: '6 months',
      saving_label: 'Save $294 (16% off)'
    },
    yearly_premium: {
      name: 'Betting Premium',
      stripe_id: 'BettingPremium-3',
      price: 1649.99,
      duration_key: 'yearly',
      duration_label: 'year',
      saving_label: 'Save $750 (40% off)'
    },
    yearly_sharp: {
      name: 'Betting Sharp',
      stripe_id: 'BettingSharp-3',
      price: 2499.99,
      duration_key: 'yearly',
      duration_label: 'year',
      saving_label: 'Save $1,087 (40% off)'
    },
  };


  dailyFantasyPlanOptions = {
    three_day_premium: {
      name: 'Fantasy Premium',
      stripe_id: 'Fantasy-4',
      price: 19.99,
      duration_key: 'three_days',
      duration_label: '3 days',
      saving_label: null
    },
    monthly_premium: {
      name: 'Fantasy Premium',
      price: 49.99,
      stripe_id: 'Fantasy-1',
      duration_key: 'monthly',
      duration_label: 'month',
      saving_label: null
    },
    six_month_premium: {
      name: 'Fantasy Premium',
      stripe_id: 'Fantasy-2',
      price: 269.99,
      duration_key: 'six_months',
      duration_label: '6 months',
      saving_label: 'Save $30 (10% off)'
    },
    yearly_premium: {
      name: 'Fantasy Premium',
      price: 419.99,
      stripe_id: 'Fantasy-3',
      duration_key: 'yearly',
      duration_label: 'year',
      saving_label: 'Save $180 (30% off)'
    },
  };
}
