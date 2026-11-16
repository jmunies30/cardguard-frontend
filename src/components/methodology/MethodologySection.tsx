import { Database, Gauge, Send, ShieldCheck } from 'lucide-react';

const STEPS = [
  {
    icon: Send,
    title: 'Transaction data is submitted',
    description: 'The transaction details are checked and sent to the prediction service in the format the model expects.',
  },
  {
    icon: Gauge,
    title: 'The trained model processes it',
    description: 'A machine learning model trained on historical transactions evaluates the submitted features.',
  },
  {
    icon: ShieldCheck,
    title: 'The model returns a classification',
    description: 'The service responds with the model\'s decision (fraud or not fraud), the fraud probability, and the decision threshold.',
  },
  {
    icon: Database,
    title: 'The prediction is displayed',
    description: 'The application shows the model\'s exact result and records it in your transaction history.',
  },
];

export function MethodologySection() {
  return (
    <div className="space-y-8">
      <p className="max-w-3xl text-sm leading-relaxed text-slate-400">
        The model was trained and evaluated on a transaction dataset in Google Colab. The application does not make its
        own fraud decisions. Every result shown comes from the trained model.
      </p>
      <ol className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {STEPS.map((step, index) => (
          <li
            key={step.title}
            className="group rounded-xl border border-slate-800 bg-slate-950/50 p-5 transition-colors duration-200 hover:border-sky-500/40"
          >
            <div className="mb-4 flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-500/10 ring-1 ring-sky-500/30">
                <step.icon className="h-4 w-4 text-sky-400" aria-hidden="true" />
              </span>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Step {index + 1}</span>
            </div>
            <h3 className="mb-2 font-semibold text-white">{step.title}</h3>
            <p className="text-sm leading-relaxed text-slate-400">{step.description}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
