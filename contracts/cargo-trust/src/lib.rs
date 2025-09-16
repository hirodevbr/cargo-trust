#![no_std]

use soroban_sdk::{contract, contractimpl, Address, Env, Symbol};

#[contract]
pub struct EscrowContract;

#[contractimpl]
impl EscrowContract {
    /// Inicializa o contrato
    pub fn init(env: Env, buyer: Address, seller: Address, arbiter: Address, amount: i128) {
        let storage = env.storage().instance();

        storage.set(&Symbol::new(&env, "buyer"), &buyer);
        storage.set(&Symbol::new(&env, "seller"), &seller);
        storage.set(&Symbol::new(&env, "arbiter"), &arbiter);
        storage.set(&Symbol::new(&env, "amount"), &amount);
        storage.set(&Symbol::new(&env, "state"), &Symbol::new(&env, "created"));
    }

    /// Depósito do comprador
    pub fn fund(env: Env, from: Address) {
        let storage = env.storage().instance();

        let buyer: Address = storage.get(&Symbol::new(&env, "buyer")).unwrap();
        let _amount: i128 = storage.get(&Symbol::new(&env, "amount")).unwrap();

        from.require_auth();

        if from == buyer {
            storage.set(&Symbol::new(&env, "state"), &Symbol::new(&env, "funded"));
            // TODO: integrar com contrato de token:
            // let token = token::Client::new(&env, &token_address);
            // token.transfer(&from, &env.current_contract_address(), &_amount);
        }
    }

    /// Liberação para o vendedor
    pub fn release(env: Env, caller: Address) {
        let storage = env.storage().instance();

        let arbiter: Address = storage.get(&Symbol::new(&env, "arbiter")).unwrap();
        let seller: Address = storage.get(&Symbol::new(&env, "seller")).unwrap();
        let _amount: i128 = storage.get(&Symbol::new(&env, "amount")).unwrap();

        caller.require_auth();

        if caller == arbiter {
            storage.set(&Symbol::new(&env, "state"), &Symbol::new(&env, "released"));
            // TODO: transferir do contrato para o vendedor:
            // token.transfer(&env.current_contract_address(), &seller, &_amount);
        }
    }

    /// Reembolso para o comprador
    pub fn refund(env: Env, caller: Address) {
        let storage = env.storage().instance();

        let arbiter: Address = storage.get(&Symbol::new(&env, "arbiter")).unwrap();
        let buyer: Address = storage.get(&Symbol::new(&env, "buyer")).unwrap();
        let _amount: i128 = storage.get(&Symbol::new(&env, "amount")).unwrap();

        caller.require_auth();

        if caller == arbiter {
            storage.set(&Symbol::new(&env, "state"), &Symbol::new(&env, "refunded"));
            // TODO: transferir de volta para o comprador:
            // token.transfer(&env.current_contract_address(), &buyer, &_amount);
        }
    }

    /// Consulta estado
    pub fn get_state(env: Env) -> Symbol {
        let storage = env.storage().instance();
        storage.get(&Symbol::new(&env, "state")).unwrap()
    }
}