# Mallory

Educational toolkit to prototype malicious [Solid](https://solidproject.org) applications
This exploration will use dedicated domain name https://mallory.monster
It is registered until 2026-10-18 and will be left to expire after that.


## Examples

### rimraf

https://rimraf.mallory.monster

This app simply runs equivalent of `rm -rf` on the storage linked from user's WebID document.
Currently it checks if storage root matches `https://mallory-says-{anything}.solidcommunity.net`,
eventually it will be relaxed to just `https://{anything}.solidcommunity.net`.

### cuckoo

https://cuckoo.mallory.monster

This app adds to user's WebID document the following statement:
```ttl
<${webid}> solid:oidcProvider <https://auth.mallory.monster>
```

It will allow Mallory to fully impersonate the user for as long as this statement stays there.

### auth

>[!TIP]
> **TODO** https://auth.mallory.monster

This service will act as Solid-OIDC provider and allow impersonating victims of [cuckoo](#cuckoo)

### omni

>[!TIP]
> **TODO** https://omni.mallory.monster

This service will be used by all the other apps to report when an account has been compromised.

### leaks

>[!TIP]
> **TODO** https://leaks.mallory.monster

This service will provide public read access to all the data from all the compromised accounts.

## Ideas

* App with backend which after user signs in uses refresh tokens to keep session alive, making it available to Mallory.
* App which changes `pim:storage` in user's WebID document to storage hosted by Mallory.
* Keep track of public WAC groups, if any member get's compromised exploit their access to group storage, use Solid Catalog.
* Service that uses compromised identities to send spam to public inboxes of all contacts.
* Using backend to circumvent `acl:origin` in WAC.
* Get all email addresses from Solid Catalog and write script that pre-registers accounts and creates pods with tainted WebID.
* Dropping html in someone's inbox with code to highjack their SolidOS auth session. Messaging them a link after using URL shortener.
