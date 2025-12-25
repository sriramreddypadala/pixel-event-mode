import { motion } from 'framer-motion';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, CheckCircle, XCircle, ArrowLeft } from 'lucide-react';
import { GlassButton } from '@/components/ui/GlassButton';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { VideoBackground } from '@/components/effects/VideoBackground';
import { useMachineStore } from '@/store/machineStore';
import { formatCurrency } from '@/utils/helpers';



export function PaymentScreen() {
  const navigate = useNavigate();
  const { session } = useMachineStore();
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'processing' | 'success' | 'failed'>('pending');

  const basePrice = session?.layout?.price || 0;

  // Clean up price calculation since we removed copies selection
  const totalPrice = basePrice;

  const handlePayment = () => {
    setPaymentStatus('processing');

    // Simulate payment processing
    setTimeout(() => {
      setPaymentStatus('success');
      setTimeout(() => {
        navigate('/machine/capture');
      }, 2000);
    }, 2000);
  };

  const handleBack = () => {
    navigate('/machine/setup');
  };

  return (
    <div className="relative min-h-screen bg-black overflow-hidden flex items-center justify-center p-8">
      <VideoBackground
        overlayOpacity={0.6}
        enableVignette={true}
      />

      <div className="relative z-20 w-full max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <GlassButton
              onClick={handleBack}
              disabled={paymentStatus !== 'pending'}
              variant="secondary"
              size="md"
              className="gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </GlassButton>

            <GlassPanel className="px-6 py-2 rounded-xl" blur="medium">
              <h1 className="text-2xl font-black text-white">
                Payment
              </h1>
            </GlassPanel>

            <div className="w-24" />
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Order Summary */}
            <GlassPanel className="p-8 rounded-3xl" blur="heavy" glow={true}>
              <h2 className="text-2xl font-bold text-white mb-6">
                Order Summary
              </h2>

              <div className="space-y-6 mb-8">
                <div className="flex justify-between items-center text-lg p-4 bg-white/5 rounded-xl border border-white/10">
                  <span className="text-gray-300">Selected Layout</span>
                  <span className="font-semibold text-white">
                    {session?.layout?.name || 'Standard Layout'}
                  </span>
                </div>

                <div className="pt-4 border-t border-white/10">
                  <div className="flex justify-between items-end">
                    <span className="text-xl font-bold text-white">Total Amount</span>
                    <span className="text-4xl font-black bg-gradient-to-r from-pixxel-orange to-pixxel-amber bg-clip-text text-transparent">
                      {formatCurrency(totalPrice)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm text-gray-400 bg-black/20 p-4 rounded-xl">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                Secure Payment • Encrypted Connection
              </div>
            </GlassPanel>

            {/* Payment Action */}
            <GlassPanel className="p-8 rounded-3xl flex flex-col justify-center items-center text-center" blur="heavy" opacity={0.8}>
              {paymentStatus === 'pending' && (
                <div className="w-full space-y-6">
                  <div className="bg-white/5 p-6 rounded-2xl border border-white/10 mb-4">
                    <CreditCard className="w-16 h-16 text-pixxel-orange mx-auto mb-4" />
                    <p className="text-lg text-gray-300">
                      Tap below to complete your payment
                    </p>
                  </div>

                  <GlassButton
                    size="xl"
                    onClick={handlePayment}
                    variant="primary"
                    pulse={true}
                    className="w-full font-black text-xl"
                  >
                    Pay {formatCurrency(totalPrice)}
                  </GlassButton>
                </div>
              )}

              {paymentStatus === 'processing' && (
                <div className="py-8">
                  <div className="relative w-24 h-24 mx-auto mb-6">
                    <div className="absolute inset-0 border-4 border-white/10 rounded-full" />
                    <div className="absolute inset-0 border-4 border-pixxel-orange border-t-transparent rounded-full animate-spin" />
                  </div>
                  <p className="text-2xl font-bold text-white mb-2">
                    Processing...
                  </p>
                  <p className="text-gray-400">
                    Please do not remove your card
                  </p>
                </div>
              )}

              {paymentStatus === 'success' && (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="py-8"
                >
                  <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-md">
                    <CheckCircle className="w-12 h-12 text-green-500" />
                  </div>
                  <h3 className="text-3xl font-black text-white mb-2">
                    Payment Successful!
                  </h3>
                  <p className="text-xl text-pixxel-orange-light animate-pulse">
                    Starting camera... 📸
                  </p>
                </motion.div>
              )}

              {paymentStatus === 'failed' && (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="py-8"
                >
                  <div className="w-24 h-24 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-md">
                    <XCircle className="w-12 h-12 text-red-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">
                    Payment Failed
                  </h3>
                  <GlassButton
                    variant="secondary"
                    onClick={() => setPaymentStatus('pending')}
                  >
                    Try Again
                  </GlassButton>
                </motion.div>
              )}
            </GlassPanel>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
