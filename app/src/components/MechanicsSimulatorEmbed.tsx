import { MechanicsSimulator } from './MechanicsSimulator';

interface MechanicsSimulatorEmbedProps {
  height?: string;
  controls?: string;
}

export function MechanicsSimulatorEmbed({ 
  height = '500px',
  controls = 'true'
}: MechanicsSimulatorEmbedProps) {
  return (
    <div className="my-4">
      <MechanicsSimulator 
        height={height}
        controls={controls === 'true'}
      />
    </div>
  );
}
