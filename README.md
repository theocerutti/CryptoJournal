# Crypto Journal

https://crypto-journal.light.ovh/auth/sign-in

Crypto Journal has been created to track your cryptos oriented portfolios.
It is a simple and easy to use tool to track your crypto investments.
This doesn't provides automatic transactions fetching (from exchanges for example) because this technique doesn't work if you use multiple wallets, multiples exchanges, DEX...
That's why this tool is fully manual.

## Screens

![image](https://user-images.githubusercontent.com/44285344/208106805-b666b50a-1764-47f3-a94a-d377e34ff7ad.png)
![image](https://user-images.githubusercontent.com/44285344/208106652-65d0b4cc-31e7-487f-94ad-d87bb5bad898.png)
![image](https://user-images.githubusercontent.com/44285344/208106704-05ca4d53-8a50-41e2-b6ba-cbc281dd02f3.png)

----

# TODOS:

Features:
* Avoir la liste des transactions (FROM OU TO) par portfolios (?portfolios=Binance,Bybit) (?portfolio=Binance,Bybit&asset=BTC,ETH)
* Avoir la liste des transactions (FROM OU TO) par asset (?asset=BTC,ETH)
* Avoir la chart total invested par portfolios
* Avoir la chart total invested par assets
* Avoir la chart total invested
* Avoir la amount total par assets
* Avoir les fees total par portfolios
* Avoir les fees total par assets
* Avoir les fees total
* Avoir les gains/loss total par portfolios
* Mettre les headers de horizon ui dans le code pour la légalité
* Dans le frontend on doit pouvoir choisir sur quel currency on voit les prix
* ajouter un Redis (au lieu du axios-cache-adapter) pour le caching de CMC
* Ajouter en DB les AssetInfo. Elles doivent se calculer de manière automatisé (à l'ajout des transaction)
* Ajouter une option dans le portfolio pour se connecter à une addresse crypto / exchange. (création des transactions grâce à l'addresse -> fetch de solscan.io par ex pour solana / ou d'une API de binance par ex)
* Pour l'instant on limite le fetch des cryptos à 1000. Il faudrait fetcher toutes les cryptos -> fetch au start de l'app TOUTE les cryptos et les mettres dans la db
* Checker le calcul des transactions dans le backend
* PNL Assets doesn't work -> we MUST labelized the asset total invested
* Transactions Seeder is wrong.

Fix/Update:
* Fix les TODOs
* Rework les tables SQL
-> si on delete la table user alors on delete toutes les autres tables
-> si on delete la table transaction alors on delete toutes les transactions-infos
-> restreindre certaines actions par SQL: ex il ne peut y avoir qu'un seul portfolio avec 'isMyBank === true' par user
