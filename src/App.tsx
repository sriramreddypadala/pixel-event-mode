import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useMachineStore } from '@/store/machineStore';
import { useBoothStore } from '@/store/boothStore';

import { BoothIdentityScreen } from '@/pages/machine/BoothIdentityScreen';
import { IdleScreen } from '@/pages/machine/IdleScreen';
import { SetupScreen } from '@/pages/machine/SetupScreen';
import { CaptureScreen } from '@/pages/machine/CaptureScreen';
import { PreviewScreen } from '@/pages/machine/PreviewScreen';
import { PaymentScreen } from '@/pages/machine/PaymentScreen';
import { PrintingScreen } from '@/pages/machine/PrintingScreen';
import { QRScreen } from '@/pages/machine/QRScreen';
import { ThankYouScreen } from '@/pages/machine/ThankYouScreen';
import { TouchInteractive } from '@/components/effects/TouchRippleEffect';

export function App() {
  const { loadConfig } = useMachineStore();
  const { hasIdentity } = useBoothStore();

  useEffect(() => {
    loadConfig();
  }, [loadConfig]);

  // Show booth identity screen if not configured
  if (!hasIdentity()) {
    return <BoothIdentityScreen />;
  }

  return (
    <BrowserRouter>
      <TouchInteractive>
        <Routes>
          <Route path="/" element={<IdleScreen />} />
          <Route path="/setup" element={<SetupScreen />} />
          <Route path="/capture" element={<CaptureScreen />} />
          <Route path="/preview" element={<PreviewScreen />} />
          <Route path="/payment" element={<PaymentScreen />} />
          <Route path="/printing" element={<PrintingScreen />} />
          <Route path="/qr" element={<QRScreen />} />
          <Route path="/thankyou" element={<ThankYouScreen />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </TouchInteractive>
    </BrowserRouter>
  );
}
