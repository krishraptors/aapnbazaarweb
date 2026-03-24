import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { CreateProductPayload } from '@/types/golamart';
import { Loader2, Plus } from 'lucide-react';

interface SellFormProps {
  isSubmitting?: boolean;
  onSubmit: (payload: CreateProductPayload) => Promise<void>;
}

const initialState = {
  farmerName: '',
  farmerPhone: '',
  cropName: '',
  state: 'Bihar',
  market: 'Patna Mandi',
  season: 'Rabi',
  cropType: 'Cereal',
  grade: '',
  price: '',
  quantity: '',
};

const cropSuggestions = [
  'Paddy',
  'White Wheat',
  'Maize',
  'Masoor',
  'Chana',
  'Mustard',
  'Potato',
  'Onion',
  'Makhana',
  'Litchi',
  'Banana',
  'Turmeric',
  'Groundnut',
  'Cotton',
];

const marketSuggestions = [
  'Patna Mandi',
  'Bhagalpur Mandi',
  'Purnea Mandi',
  'Samastipur Mandi',
  'Muzaffarpur Fruit Mandi',
  'Nalanda Vegetable Yard',
  'Darbhanga Makhana Hub',
  'Rajkot Cotton Yard',
  'Nizamabad Spice Market',
  'Karnal Mandi',
];

const stateOptions = [
  'Bihar',
  'Haryana',
  'Punjab',
  'Uttar Pradesh',
  'Rajasthan',
  'Madhya Pradesh',
  'Gujarat',
  'Maharashtra',
  'Telangana',
  'Andhra Pradesh',
  'Karnataka',
  'Kerala',
  'Assam',
  'West Bengal',
];

const seasonOptions = ['Kharif', 'Rabi', 'Zaid', 'Perennial'];
const cropTypeOptions = [
  'Cereal',
  'Pulse',
  'Oilseed',
  'Vegetable',
  'Fruit',
  'Fiber',
  'Spice',
  'Specialty',
];

const selectClassName =
  'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground ring-offset-background';

export default function SellForm({ isSubmitting = false, onSubmit }: SellFormProps) {
  const [formData, setFormData] = useState(initialState);

  const handleChange = (field: keyof typeof initialState, value: string) => {
    setFormData((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const payload = {
      farmerName: formData.farmerName.trim(),
      farmerPhone: formData.farmerPhone.trim(),
      cropName: formData.cropName.trim(),
      state: formData.state.trim(),
      market: formData.market.trim(),
      season: formData.season.trim(),
      cropType: formData.cropType.trim(),
      grade: formData.grade.trim(),
      price: Number(formData.price),
      quantity: Number(formData.quantity),
    };

    if (!payload.farmerName || !payload.farmerPhone || !payload.cropName) {
      return;
    }

    await onSubmit(payload);
    setFormData(initialState);
  };

  return (
    <Card className="border-emerald-200/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(240,253,244,0.94))] shadow-[0_24px_80px_-52px_rgba(22,101,52,0.18)] dark:border-emerald-900/50 dark:bg-[linear-gradient(180deg,rgba(6,24,16,0.98),rgba(8,34,22,0.94))]">
      <CardContent className="p-6 sm:p-7">
        <div className="mb-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
            Farmer onboarding
          </div>
          <h3 className="font-heading mt-4 text-2xl font-semibold">Sell crops on GolaMart</h3>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Add Bihar mandi crops, rabi fasal, or pan-India produce directly into the
            marketplace board.
          </p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="farmerName">Farmer name</Label>
            <Input
              id="farmerName"
              placeholder="Ramesh Kumar"
              value={formData.farmerName}
              onChange={(event) => handleChange('farmerName', event.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="farmerPhone">Phone number</Label>
            <Input
              id="farmerPhone"
              placeholder="+91 98765 43210"
              value={formData.farmerPhone}
              onChange={(event) => handleChange('farmerPhone', event.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cropName">Crop name</Label>
            <Input
              id="cropName"
              placeholder="Paddy"
              list="golamart-crop-suggestions"
              value={formData.cropName}
              onChange={(event) => handleChange('cropName', event.target.value)}
              required
            />
            <datalist id="golamart-crop-suggestions">
              {cropSuggestions.map((crop) => (
                <option key={crop} value={crop} />
              ))}
            </datalist>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <select
                id="state"
                value={formData.state}
                onChange={(event) => handleChange('state', event.target.value)}
                className={selectClassName}
              >
                {stateOptions.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="market">Market / mandi</Label>
              <Input
                id="market"
                placeholder="Patna Mandi"
                list="golamart-market-suggestions"
                value={formData.market}
                onChange={(event) => handleChange('market', event.target.value)}
              />
              <datalist id="golamart-market-suggestions">
                {marketSuggestions.map((market) => (
                  <option key={market} value={market} />
                ))}
              </datalist>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="season">Season</Label>
              <select
                id="season"
                value={formData.season}
                onChange={(event) => handleChange('season', event.target.value)}
                className={selectClassName}
              >
                {seasonOptions.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cropType">Crop type</Label>
              <select
                id="cropType"
                value={formData.cropType}
                onChange={(event) => handleChange('cropType', event.target.value)}
                className={selectClassName}
              >
                {cropTypeOptions.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="grade">Grade</Label>
              <Input
                id="grade"
                placeholder="FAQ / Grade A"
                value={formData.grade}
                onChange={(event) => handleChange('grade', event.target.value)}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="price">Price per quintal</Label>
              <Input
                id="price"
                type="number"
                min="1"
                placeholder="1450"
                value={formData.price}
                onChange={(event) => handleChange('price', event.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                placeholder="40"
                value={formData.quantity}
                onChange={(event) => handleChange('quantity', event.target.value)}
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            className="h-11 w-full rounded-full bg-[linear-gradient(135deg,#15803d,#65a30d)] text-white hover:opacity-95"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Publishing listing
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" />
                Add crop listing
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
