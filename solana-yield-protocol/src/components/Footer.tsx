import { Shield, Github, Twitter, FileText, ExternalLink } from 'lucide-react'

export function Footer() {
  return (
    <footer className="relative border-t border-white/[0.04] mt-16 hidden md:block"
      style={{ background: 'rgba(3,10,10,0.6)' }}
    >
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-gradient-to-br from-elp-400 to-elp-600 flex items-center justify-center">
                <span className="text-[8px] font-bold text-surface-0">⚡</span>
              </div>
              <span className="font-display font-bold text-sm text-white">ELPEDA</span>
            </div>
            <p className="text-white/30 text-xs font-body leading-relaxed max-w-xs">
              Intent-native yield intelligence on Solana. AI-powered vault optimization
              with institutional-grade risk management.
            </p>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-elp-500/10 border border-elp-500/15">
                <Shield className="w-3 h-3 text-elp-400" />
                <span className="font-mono text-[9px] text-elp-400">Audited by Hacken</span>
              </div>
            </div>
          </div>

          {/* Protocol */}
          <div>
            <h4 className="font-display font-semibold text-white text-xs mb-3">Protocol</h4>
            <ul className="space-y-2">
              {['Yield Vaults', 'Swap', 'Analytics', 'Governance', 'Token Launch'].map(item => (
                <li key={item}>
                  <a href="#" className="text-white/30 hover:text-white/60 text-xs font-body transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-display font-semibold text-white text-xs mb-3">Resources</h4>
            <ul className="space-y-2">
              {[
                { label: 'Documentation', icon: FileText },
                { label: 'GitHub', icon: Github },
                { label: 'Audit Report', icon: Shield },
                { label: 'Bug Bounty', icon: ExternalLink },
              ].map(item => (
                <li key={item.label}>
                  <a href="#" className="flex items-center gap-1.5 text-white/30 hover:text-white/60 text-xs font-body transition-colors">
                    <item.icon className="w-3 h-3" />
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Community */}
          <div>
            <h4 className="font-display font-semibold text-white text-xs mb-3">Community</h4>
            <div className="flex items-center gap-2 mb-4">
              {[
                { icon: Twitter, href: '#' },
                { icon: Github, href: '#' },
              ].map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-white/30 hover:text-elp-400 hover:border-elp-500/20 transition-colors"
                >
                  <social.icon className="w-3.5 h-3.5" />
                </a>
              ))}
            </div>
            <p className="text-white/15 text-[10px] font-mono">Built on Solana</p>
            <p className="text-white/15 text-[10px] font-mono mt-0.5">For the Buildifi Hackathon</p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-6 border-t border-white/[0.04] flex items-center justify-between">
          <span className="text-white/15 text-[10px] font-mono">
            © 2025 Elpeda Protocol. All rights reserved.
          </span>
          <div className="flex items-center gap-4">
            <span className="text-white/15 text-[10px] font-mono">v1.0.0</span>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-elp-400" />
              <span className="text-white/15 text-[10px] font-mono">Solana Mainnet</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
