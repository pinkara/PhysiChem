import { CircuitSimulator } from './CircuitSimulator';

interface CircuitSimulatorEmbedProps {
  height?: string;
  controls?: string;
}

export function CircuitSimulatorEmbed({ 
  height = '450px',
  controls = 'true'
}: CircuitSimulatorEmbedProps) {
  return (
    <div className="my-4">
      <CircuitSimulator 
        height={height}
        controls={controls === 'true'}
      />
    </div>
  );
}
