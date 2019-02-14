# Muna

> 1. (verb) (-ia) to talk privately.
> 2. (stative) be confidential, anonymous, secretly.
> 3. (noun) secret, confidentiality, secrecy.

Simple React app for encrypting secrets so that you can email then, post in Jira, etc.
It's like [Muna](https://github.com/krasio/muna) but client side, using [keybase/kbpgp](https://github.com/keybase/kbpgp) for encryption.

## Configuration

#### Public keys

Recipients's public keys should be provided as json array in `/recipients.json` file in project root.

Example:

```
[
  "-----BEGIN PGP PUBLIC KEY BLOCK-----\nVersion: GnuPG v1\n\nmQENBF...v9x/\n-----END PGP PUBLIC KEY BLOCK-----\n",
  "-----BEGIN PGP PUBLIC KEY BLOCK-----\nVersion: GnuPG v1\n\eVTogBC...uhV/\n-----END PGP PUBLIC KEY BLOCK-----\n"
]
```
