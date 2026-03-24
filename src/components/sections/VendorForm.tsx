import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { vendorApi } from '@/db/api';
import type { VendorRegistration } from '@/types/types';
import { Loader2, CheckCircle2 } from 'lucide-react';

export default function VendorForm() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState<Omit<VendorRegistration, 'id' | 'created_at' | 'updated_at'>>({
    business_name: '',
    contact_person_name: '',
    mobile_number: '',
    email: '',
    business_type: 'Factory',
    product_categories: '',
    location: '',
    additional_info: ''
  });

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await vendorApi.createVendorRegistration(formData);
      setIsSuccess(true);
      toast({
        title: 'Registration Successful!',
        description: 'Thank you for registering. Our team will contact you soon.',
      });

      // Reset form after 3 seconds
      setTimeout(() => {
        setFormData({
          business_name: '',
          contact_person_name: '',
          mobile_number: '',
          email: '',
          business_type: 'Factory',
          product_categories: '',
          location: '',
          additional_info: ''
        });
        setIsSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: 'Registration Failed',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="vendor-form" className="py-20 xl:py-32 bg-muted/30">
      <div className="container px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl xl:text-5xl font-bold mb-4">
            Register as a <span className="gradient-text">Vendor</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Join thousands of businesses already trading on AapnBazaar. Fill out the form below to get started.
          </p>
        </div>

        <Card className="max-w-3xl mx-auto border-border">
          <CardHeader>
            <CardTitle>Vendor Registration Form</CardTitle>
            <CardDescription>
              Please provide accurate information about your business. All fields are required unless marked optional.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-6 xl:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="business_name">Business Name *</Label>
                  <Input
                    id="business_name"
                    value={formData.business_name}
                    onChange={(e) => handleInputChange('business_name', e.target.value)}
                    placeholder="Enter your business name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact_person_name">Contact Person Name *</Label>
                  <Input
                    id="contact_person_name"
                    value={formData.contact_person_name}
                    onChange={(e) => handleInputChange('contact_person_name', e.target.value)}
                    placeholder="Enter contact person name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mobile_number">Mobile Number *</Label>
                  <Input
                    id="mobile_number"
                    type="tel"
                    value={formData.mobile_number}
                    onChange={(e) => handleInputChange('mobile_number', e.target.value)}
                    placeholder="+91 XXXXX XXXXX"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="your@email.com"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="business_type">Business Type *</Label>
                  <Select
                    value={formData.business_type}
                    onValueChange={(value) => handleInputChange('business_type', value)}
                  >
                    <SelectTrigger id="business_type">
                      <SelectValue placeholder="Select business type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Factory">Factory</SelectItem>
                      <SelectItem value="Wholesaler">Wholesaler</SelectItem>
                      <SelectItem value="Shop">Shop</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location *</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    placeholder="City, State"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="product_categories">Product Categories *</Label>
                <Input
                  id="product_categories"
                  value={formData.product_categories}
                  onChange={(e) => handleInputChange('product_categories', e.target.value)}
                  placeholder="e.g., Electronics, Textiles, FMCG"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="additional_info">Additional Information (Optional)</Label>
                <Textarea
                  id="additional_info"
                  value={formData.additional_info}
                  onChange={(e) => handleInputChange('additional_info', e.target.value)}
                  placeholder="Tell us more about your business..."
                  rows={4}
                />
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={isSubmitting || isSuccess}
              >
                {isSubmitting && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                {isSuccess && <CheckCircle2 className="mr-2 h-5 w-5" />}
                {isSuccess ? 'Registration Successful!' : isSubmitting ? 'Submitting...' : 'Register Now'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
