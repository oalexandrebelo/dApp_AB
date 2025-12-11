"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'pt' | 'es';

type Translations = {
    landing: {
        hero: {
            title_start: string;
            title_highlight: string;
            subtitle: string;
            launch_app: string;
            docs: string;
        };
        features: {
            cross_chain_title: string;
            cross_chain_desc: string;
            institutional_title: string;
            institutional_desc: string;
            instant_title: string;
            instant_desc: string;
        };
    };
    dashboard: {
        sidebar: {
            dashboard: string;
            supply: string;
            borrow: string;
            bridge: string;
            transactions: string;
            analytics: string;
            settings: string;
        };
        header: {
            title: string;
            subtitle: string;
        };
        stats: {
            net_worth: string;
            net_apy: string;
            total_supplied: string;
            total_borrowed: string;
            weighted_avg: string;
            from_last_month: string;
        };
        assets: {
            title: string;
            borrowed_title: string;
            no_assets_borrowed: string;
            wallet_balance: string;
        };
        // ... (skipping some lines for brevity in thought, but I need to target the Type definition first)
        // actually I should probably do multiple replacements or one big one if they are close. They are not that close.
        // I will use multi_replace.

        health_factor: {
            title: string;
            status_safe: string;
            status_risk: string;
            liquidation_warning: string;
        };
        supply_page: {
            title: string;
            subtitle: string;
        };
        borrow_page: {
            title: string;
            subtitle: string;
        };
        transactions_page: {
            title: string;
            subtitle: string;
        };
        analytics_page: {
            title: string;
            subtitle: string;
            tvl_title: string;
            volume_title: string;
        };
        settings_page: {
            title: string;
            subtitle: string;
            interface_title: string;
            interface_desc: string;
            reduced_motion: string;
            reduced_motion_desc: string;
            security_title: string;
            security_desc: string;
            connected_text: string;
            disconnect_btn: string;
        };
        asset_table: {
            asset: string;
            balance: string;
            apy: string;
            action: string;
            supply_btn: string;
            borrow_btn: string;
        };
    };
    modals: {
        supply: {
            title: string;
            amount_label: string;
            confirm_btn: string;
            approving: string;
            supplying: string;
            success: string;
        };
        borrow: {
            title: string;
            amount_label: string;
            confirm_btn: string;
            processing: string;
            success: string;
        };
    };
};

const translations: Record<Language, Translations> = {
    en: {
        landing: {
            hero: {
                title_start: "The Future of",
                title_highlight: "DeFi Lending",
                subtitle: "Experience the next generation of cross-chain lending and borrowing using CCTP. Instant, secure, and purely decentralized.",
                launch_app: "Launch dApp",
                docs: "Documentation"
            },
            features: {
                cross_chain_title: "Cross-Chain Native",
                cross_chain_desc: "Seamlessly lend and borrow across Ethereum, Base, Optimism and more using Circle CCTP.",
                institutional_title: "Institutional Grade",
                institutional_desc: "Audited smart contracts and rigorous risk management parameters for your assets.",
                instant_title: "Instant Finality",
                instant_desc: "Lightning fast transactions with optimized gas usage and instant settlement."
            }
        },
        dashboard: {
            sidebar: {
                dashboard: "Dashboard",
                supply: "Supply",
                borrow: "Borrow",
                bridge: "Bridge",
                transactions: "Transactions",
                analytics: "Analytics",
                settings: "Settings"
            },
            header: {
                title: "Dashboard",
                subtitle: "Overview of your assets and positions."
            },
            stats: {
                net_worth: "Net Worth",
                net_apy: "Net APY",
                total_supplied: "Total Supplied",
                total_borrowed: "Total Borrowed",
                weighted_avg: "Weighted average",
                from_last_month: "+0% from last month"
            },
            assets: {
                title: "Assets",
                borrowed_title: "Borrowed Assets",
                no_assets_borrowed: "No assets borrowed",
                wallet_balance: "Wallet Balance"
            },
            health_factor: {
                title: "Health Factor",
                status_safe: "Safe",
                status_risk: "At Risk",
                liquidation_warning: "Liquidation Risk"
            },
            supply_page: {
                title: "Supply Assets",
                subtitle: "Deposit your assets to earn yield."
            },
            borrow_page: {
                title: "Borrow Assets",
                subtitle: "Borrow against your collateral."
            },
            transactions_page: {
                title: "Transactions History",
                subtitle: "Your recent protocol interactions will appear here."
            },
            analytics_page: {
                title: "Analytics",
                subtitle: "Protocol performance and statistics.",
                tvl_title: "Total Value Locked (TVL)",
                volume_title: "Daily Volume"
            },
            settings_page: {
                title: "Settings",
                subtitle: "Manage your interface preferences and account security.",
                interface_title: "Interface",
                interface_desc: "Customize your visual experience.",
                reduced_motion: "Reduced Motion",
                reduced_motion_desc: "Minimize animations for a simpler experience.",
                security_title: "Security & Privacy",
                security_desc: "Manage your connected wallet permissions.",
                connected_text: "You are currently connected to Arc Testnet via RainbowKit. Disconnecting your wallet will clear your local session.",
                disconnect_btn: "Disconnect Wallet (Simulated)"
            },
            asset_table: {
                asset: "Asset",
                balance: "Balance",
                apy: "APY",
                action: "Action",
                supply_btn: "Supply",
                borrow_btn: "Borrow"
            }
        },
        modals: {
            supply: {
                title: "Supply Asset",
                amount_label: "Amount",
                confirm_btn: "Confirm Supply",
                approving: "Approving...",
                supplying: "Supplying...",
                success: "Supply Successful!"
            },
            borrow: {
                title: "Borrow Asset",
                amount_label: "Amount",
                confirm_btn: "Confirm Borrow",
                processing: "Processing...",
                success: "Borrow Successful!"
            }
        }
    },
    pt: {
        landing: {
            hero: {
                title_start: "O Futuro do",
                title_highlight: "Empréstimo DeFi",
                subtitle: "Experimente a próxima geração de empréstimos cross-chain usando CCTP. Instantâneo, seguro e puramente descentralizado.",
                launch_app: "Lançar dApp",
                docs: "Documentação"
            },
            features: {
                cross_chain_title: "Nativo Cross-Chain",
                cross_chain_desc: "Empréstimos sem interrupções entre Ethereum, Base, Optimism e mais usando Circle CCTP.",
                institutional_title: "Nível Institucional",
                institutional_desc: "Contratos inteligentes auditados e parâmetros rigorosos de gestão de risco para seus ativos.",
                instant_title: "Finalidade Instantânea",
                instant_desc: "Transações extremamente rápidas com uso otimizado de gás e liquidação instantânea."
            }
        },
        dashboard: {
            sidebar: {
                dashboard: "Painel",
                supply: "Fornecer",
                borrow: "Emprestar",
                bridge: "Ponte",
                transactions: "Transações",
                analytics: "Analise",
                settings: "Ajustes"
            },
            header: {
                title: "Painel",
                subtitle: "Visão geral de seus ativos e posições."
            },
            stats: {
                net_worth: "Patrimônio Líquido",
                net_apy: "APY Líquido",
                total_supplied: "Total Fornecido",
                total_borrowed: "Total Emprestado",
                weighted_avg: "Média ponderada",
                from_last_month: "+0% do último mês"
            },
            assets: {
                title: "Ativos",
                borrowed_title: "Ativos Emprestados",
                no_assets_borrowed: "Nenhum ativo emprestado",
                wallet_balance: "Saldo da Carteira"
            },
            health_factor: {
                title: "Fator de Saúde",
                status_safe: "Seguro",
                status_risk: "Em Risco",
                liquidation_warning: "Risco de Liquidação"
            },
            supply_page: {
                title: "Fornecer Ativos",
                subtitle: "Deposite seus ativos para ganhar rendimentos."
            },
            borrow_page: {
                title: "Tomar Empréstimo",
                subtitle: "Tome emprestado contra sua garantia."
            },
            transactions_page: {
                title: "Histórico de Transações",
                subtitle: "Suas interações recentes com o protocolo aparecerão aqui."
            },
            analytics_page: {
                title: "Analise",
                subtitle: "Desempenho e estatísticas do protocolo.",
                tvl_title: "Valor Total Bloqueado (TVL)",
                volume_title: "Volume Diário"
            },
            settings_page: {
                title: "Ajustes",
                subtitle: "Gerencie suas preferências de interface e segurança da conta.",
                interface_title: "Interface",
                interface_desc: "Personalize sua experiência visual.",
                reduced_motion: "Movimento Reduzido",
                reduced_motion_desc: "Minimize animações para uma experiência mais simples.",
                security_title: "Segurança e Privacidade",
                security_desc: "Gerencie as permissões da sua carteira conectada.",
                connected_text: "Você está atualmente conectado à Arc Testnet via RainbowKit. Desconectar sua carteira limpará sua sessão local.",
                disconnect_btn: "Desconectar Carteira (Simulado)"
            },
            asset_table: {
                asset: "Ativo",
                balance: "Saldo",
                apy: "APY",
                action: "Ação",
                supply_btn: "Fornecer",
                borrow_btn: "Tomar"
            }
        },
        modals: {
            supply: {
                title: "Fornecer Ativo",
                amount_label: "Quantia",
                confirm_btn: "Confirmar Fornecimento",
                approving: "Aprovando...",
                supplying: "Fornecendo...",
                success: "Sucesso!"
            },
            borrow: {
                title: "Tomar Empréstimo",
                amount_label: "Quantia",
                confirm_btn: "Confirmar Empréstimo",
                processing: "Processando...",
                success: "Sucesso!"
            }
        }
    },
    es: {
        landing: {
            hero: {
                title_start: "El Futuro de",
                title_highlight: "Préstamos DeFi",
                subtitle: "Experimente la próxima generación de préstamos cross-chain usando CCTP. Instantáneo, seguro y puramente descentralizado.",
                launch_app: "Lanzar dApp",
                docs: "Documentación"
            },
            features: {
                cross_chain_title: "Nativo Cross-Chain",
                cross_chain_desc: "Préstamos sin interrupciones entre Ethereum, Base, Optimism y más usando Circle CCTP.",
                institutional_title: "Grado Institucional",
                institutional_desc: "Contratos inteligentes auditados y rigurosos parámetros de gestión de riesgo para sus activos.",
                instant_title: "Finalidad Instantánea",
                instant_desc: "Transacciones ultrarrápidas con uso optimizado de gas y liquidación instantánea."
            }
        },
        dashboard: {
            sidebar: {
                dashboard: "Panel",
                supply: "Proveer",
                borrow: "Prestar",
                bridge: "Puente",
                transactions: "Transacciones",
                analytics: "Analítica",
                settings: "Ajustes"
            },
            header: {
                title: "Panel",
                subtitle: "Resumen de sus activos y posiciones."
            },
            stats: {
                net_worth: "Valor Neto",
                net_apy: "APY Neto",
                total_supplied: "Total Provisto",
                total_borrowed: "Total Prestado",
                weighted_avg: "Promedio ponderado",
                from_last_month: "+0% del último mes"
            },
            assets: {
                title: "Activos",
                borrowed_title: "Activos Prestados",
                no_assets_borrowed: "Ningún activo prestado",
                wallet_balance: "Saldo de Billetera"
            },
            health_factor: {
                title: "Factor de Salud",
                status_safe: "Seguro",
                status_risk: "En Riesgo",
                liquidation_warning: "Riesgo de Liquidación"
            },
            supply_page: {
                title: "Proveer Activos",
                subtitle: "Deposite sus activos para obtener rendimiento."
            },
            borrow_page: {
                title: "Tomar Préstamo",
                subtitle: "Pida prestado contra su garantía."
            },
            transactions_page: {
                title: "Historial de Transacciones",
                subtitle: "Sus interacciones recientes con el protocolo aparecerán aquí."
            },
            analytics_page: {
                title: "Analítica",
                subtitle: "Rendimiento y estadísticas del protocolo.",
                tvl_title: "Valor Total Bloqueado (TVL)",
                volume_title: "Volumen Diario"
            },
            settings_page: {
                title: "Ajustes",
                subtitle: "Administre sus preferencias de interfaz y seguridad de la cuenta.",
                interface_title: "Interfaz",
                interface_desc: "Personalice su experiencia visual.",
                reduced_motion: "Movimiento Reducido",
                reduced_motion_desc: "Minimice las animaciones para una experiencia más simple.",
                security_title: "Seguridad y Privacidad",
                security_desc: "Administre los permisos de su billetera conectada.",
                connected_text: "Actualmente está conectado a Arc Testnet a través de RainbowKit. Desconectar su billetera borrará su sesión local.",
                disconnect_btn: "Desconectar Billetera (Simulada)"
            },
            asset_table: {
                asset: "Activo",
                balance: "Saldo",
                apy: "APY",
                action: "Acción",
                supply_btn: "Proveer",
                borrow_btn: "Tomar"
            }
        },
        modals: {
            supply: {
                title: "Proveer Activo",
                amount_label: "Cantidad",
                confirm_btn: "Confirmar Provisión",
                approving: "Aprobando...",
                supplying: "Proveyendo...",
                success: "Exitoso!"
            },
            borrow: {
                title: "Tomar Préstamo",
                amount_label: "Cantidad",
                confirm_btn: "Confirmar Préstamo",
                processing: "Procesando...",
                success: "Exitoso!"
            }
        }
    }
};

type LanguageContextType = {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: Translations;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [language, setLanguage] = useState<Language>('en');

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t: translations[language] }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}
