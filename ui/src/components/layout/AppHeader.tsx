import {
  Header,
  HeaderName,
  HeaderGlobalBar,
  HeaderGlobalAction,
} from "@carbon/react";
import { Tag } from "@carbon/react";
import { Light, Asleep, Chat } from "@carbon/icons-react";

interface AppHeaderProps {
  isDark: boolean;
  onToggleTheme: () => void;
  onToggleAssistant: () => void;
  onToggleSideNav: () => void;
}

export function AppHeader({ isDark, onToggleTheme, onToggleAssistant, onToggleSideNav }: AppHeaderProps) {
  return (
    <Header aria-label="Idea Factory" className="fixed top-0 left-0 right-0 z-50">
      <button
        className="cds--header__menu-trigger cds--header__action"
        aria-label="Toggle side navigation"
        onClick={onToggleSideNav}
        type="button"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
          <rect x="2" y="4" width="16" height="2" />
          <rect x="2" y="9" width="16" height="2" />
          <rect x="2" y="14" width="16" height="2" />
        </svg>
      </button>
      <HeaderName href="/" prefix="">
        Idea Factory
      </HeaderName>
      <Tag type="blue" size="sm" className="ml-2">
        Idea Factory
      </Tag>
      <HeaderGlobalBar>
        <HeaderGlobalAction
          aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
          onClick={onToggleTheme}
        >
          {isDark ? <Light size={20} /> : <Asleep size={20} />}
        </HeaderGlobalAction>
        <HeaderGlobalAction
          aria-label="Toggle AI Assistant"
          onClick={onToggleAssistant}
        >
          <Chat size={20} />
        </HeaderGlobalAction>
      </HeaderGlobalBar>
    </Header>
  );
}
