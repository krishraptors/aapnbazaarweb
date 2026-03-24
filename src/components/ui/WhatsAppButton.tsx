import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';

interface WhatsAppButtonProps {
  phoneNumber?: string;
  message?: string;
  className?: string;
  variant?: 'default' | 'outline' | 'secondary';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export default function WhatsAppButton({
  phoneNumber = '919876543210', // Default phone number (replace with actual)
  message = 'Hello! I would like to know more about Aapnazaar.',
  className = '',
  variant = 'default',
  size = 'default'
}: WhatsAppButtonProps) {
  const handleWhatsAppClick = () => {
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <Button
      onClick={handleWhatsAppClick}
      variant={variant}
      size={size}
      className={`bg-[#25D366] hover:bg-[#20BA5A] text-white ${className}`}
    >
      <MessageCircle className="mr-2 h-5 w-5" />
      WhatsApp Us
    </Button>
  );
}
