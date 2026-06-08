import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PiggyAvatar } from '../components/gamification/PiggyAvatar';
import { AVATAR_KEY, defaultAvatar } from '../services/avatarService';
import type { AvatarConfig } from '../types/gamification';

const SKIN_COLORS = [
  { hex: '#22C55E', label: 'Verde' },
  { hex: '#F59E0B', label: 'Dourado' },
  { hex: '#818CF8', label: 'Roxo' },
  { hex: '#38BDF8', label: 'Azul' },
  { hex: '#FB923C', label: 'Laranja' },
  { hex: '#F472B6', label: 'Rosa' },
];

type AccessoryItem = { id: string | null; label: string; minLevel: number };

const HATS: AccessoryItem[] = [
  { id: null,    label: 'Nenhum',        minLevel: 0 },
  { id: 'bone',  label: 'Boné verde',    minLevel: 0 },
  { id: 'coroa', label: 'Coroa dourada', minLevel: 0 },
  { id: 'festa', label: 'Chapéu festa',  minLevel: 0 },
  { id: 'cowboy',  label: 'Cowboy',      minLevel: 10 },
  { id: 'magico',  label: 'Chapéu mágico', minLevel: 15 },
];

const GLASSES: AccessoryItem[] = [
  { id: null,      label: 'Nenhum',       minLevel: 0 },
  { id: 'sol',     label: 'Óculos de sol', minLevel: 0 },
  { id: 'redondo', label: 'Óculos redondo', minLevel: 0 },
  { id: 'estrela', label: 'Óculos estrela', minLevel: 8 },
  { id: 'coracao', label: 'Óculos coração', minLevel: 12 },
];

const NECKS: AccessoryItem[] = [
  { id: null,             label: 'Nenhum',          minLevel: 0 },
  { id: 'corrente',       label: 'Corrente dourada', minLevel: 0 },
  { id: 'gravata_borboleta', label: 'Gravata borboleta', minLevel: 0 },
  { id: 'gravata',        label: 'Gravata',         minLevel: 10 },
  { id: 'flores',         label: 'Coleira de flores', minLevel: 14 },
];

const CHESTS: AccessoryItem[] = [
  { id: 'coin',    label: 'Moeda $',   minLevel: 0 },
  { id: 'heart',   label: 'Coração',   minLevel: 0 },
  { id: 'star',    label: 'Estrela',   minLevel: 0 },
  { id: 'diamond', label: 'Diamante',  minLevel: 9 },
  { id: 'flame',   label: 'Chama',     minLevel: 13 },
];

type TabKey = 'hat' | 'glasses' | 'neck' | 'chest';

const TABS: { key: TabKey; label: string; items: AccessoryItem[] }[] = [
  { key: 'hat',     label: 'Chapéus',  items: HATS },
  { key: 'glasses', label: 'Óculos',   items: GLASSES },
  { key: 'neck',    label: 'Pescoço',  items: NECKS },
  { key: 'chest',   label: 'Peito',    items: CHESTS },
];

const loadConfig = (): AvatarConfig => {
  try {
    const s = localStorage.getItem(AVATAR_KEY);
    return s ? { ...defaultAvatar, ...JSON.parse(s) } : { ...defaultAvatar };
  } catch { return { ...defaultAvatar }; }
};

const currentLevel = () => {
  const xp = parseInt(localStorage.getItem('pgm_xp') || '0');
  return Math.floor(xp / 500) + 1;
};

const AvatarCustomizerPage = () => {
  const navigate = useNavigate();
  const level = currentLevel();
  const [config, setConfig] = useState<AvatarConfig>(loadConfig);
  const [tab, setTab] = useState<TabKey>('hat');
  const [saved, setSaved] = useState(false);

  const currentTab = TABS.find(t => t.key === tab)!;
  const selectedId = config[tab] as string | null;

  const select = (id: string | null) => {
    setSaved(false);
    if (tab === 'chest') {
      setConfig(c => ({ ...c, chest: id ?? 'coin' }));
    } else {
      setConfig(c => ({ ...c, [tab]: id }));
    }
  };

  const equip = () => {
    localStorage.setItem(AVATAR_KEY, JSON.stringify(config));
    setSaved(true);
    setTimeout(() => navigate('/objetivos'), 800);
  };

  const selectedItem = currentTab.items.find(i => i.id === selectedId);

  return (
    <div style={{ minHeight: '100vh', background: '#0D1117', color: '#F1F5F9', fontFamily: 'inherit' }}>
      <div style={{
        background: '#161B24', padding: '16px 20px',
        display: 'flex', alignItems: 'center', gap: 14,
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        position: 'sticky', top: 0, zIndex: 10,
      }}>
        <button onClick={() => navigate('/objetivos')}
          style={{ background: 'none', border: 'none', color: '#8890A6', fontSize: 20, cursor: 'pointer', padding: 0, lineHeight: 1 }}>
          ←
        </button>
        <h1 style={{ fontSize: 17, fontWeight: 800, margin: 0, flex: 1 }}>Meu avatar</h1>
        <div style={{ fontSize: 12, color: '#8890A6' }}>Nível {level}</div>
      </div>

      <div style={{ maxWidth: 480, margin: '0 auto', padding: '20px 16px 120px' }}>

        <div style={{
          background: '#1E2533', borderRadius: 24, padding: '32px 20px',
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          gap: 12, marginBottom: 24,
        }}>
          <PiggyAvatar size={160} config={config} animated/>
          <div style={{ fontSize: 13, color: '#8890A6' }}>Preview em tempo real</div>
        </div>

        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 12, color: '#8890A6', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: 10 }}>
            Cor do porquinho
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            {SKIN_COLORS.map(c => (
              <button key={c.hex} onClick={() => { setConfig(cfg => ({ ...cfg, skinColor: c.hex })); setSaved(false); }}
                title={c.label}
                style={{
                  width: 36, height: 36, borderRadius: '50%',
                  background: c.hex, border: 'none', cursor: 'pointer',
                  outline: config.skinColor === c.hex ? `3px solid #F59E0B` : '3px solid transparent',
                  outlineOffset: 2, transition: 'outline 0.15s',
                }}
              />
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          {TABS.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              style={{
                flex: 1, padding: '8px 4px', borderRadius: 8, fontSize: 12, fontWeight: 600,
                cursor: 'pointer', border: 'none', transition: 'all 0.15s',
                background: tab === t.key ? '#22C55E' : '#1E2533',
                color: tab === t.key ? '#000' : '#8890A6',
              }}>
              {t.label}
            </button>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
          {currentTab.items.map(item => {
            const locked = item.minLevel > 0 && level < item.minLevel;
            const isSelected = selectedId === item.id;
            const previewCfg: AvatarConfig = {
              ...config,
              [tab]: item.id,
              ...(tab === 'chest' && item.id !== null ? { chest: item.id } : {}),
            };
            return (
              <button
                key={String(item.id)}
                onClick={() => !locked && select(item.id)}
                disabled={locked}
                style={{
                  background: '#1E2533',
                  border: isSelected ? '2px solid #22C55E' : '1px solid rgba(255,255,255,0.07)',
                  borderRadius: 12, padding: '10px 6px',
                  cursor: locked ? 'not-allowed' : 'pointer',
                  opacity: locked ? 0.45 : 1,
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                  transition: 'border 0.15s',
                }}
              >
                <PiggyAvatar size={56} config={previewCfg}/>
                <span style={{ fontSize: 11, color: isSelected ? '#22C55E' : '#F1F5F9', fontWeight: isSelected ? 700 : 400, textAlign: 'center', lineHeight: 1.3 }}>
                  {item.label}
                </span>
                {locked && (
                  <span style={{
                    fontSize: 10, fontWeight: 700, color: '#F59E0B',
                    background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.3)',
                    borderRadius: 10, padding: '2px 6px',
                  }}>
                    Nível {item.minLevel}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        background: '#161B24', borderTop: '1px solid rgba(255,255,255,0.07)',
        padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 14,
      }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 11, color: '#8890A6' }}>Selecionado</div>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#F1F5F9', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {selectedItem?.label ?? '—'}
          </div>
        </div>
        <button onClick={equip} style={{
          padding: '12px 28px', background: saved ? '#22C55E' : '#F59E0B',
          color: '#000', border: 'none', borderRadius: 10,
          fontSize: 14, fontWeight: 900, cursor: 'pointer',
          transition: 'background 0.2s', whiteSpace: 'nowrap',
        }}>
          {saved ? '✓ Salvo!' : 'Equipar ✨'}
        </button>
      </div>
    </div>
  );
};

export default AvatarCustomizerPage;
