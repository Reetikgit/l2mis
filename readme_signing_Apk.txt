
Generating Keystore : keytool -genkey -v -keystore NAME-l2mmis.keystore -alias l2mmis -keyalg RSA -keysize 2048 -validity 10000

password:l2mmis

Signing Apk :  jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore NAME-l2mmis.keystore release/app-release-unsigned.apk l2mmis

Zipalign path - C:\Users\reeti\AppData\Local\Android\Sdk\build-tools\30.0.3

Releasing Signed Apk : C:\Users\reeti\AppData\Local\Android\Sdk\build-tools\30.0.3\zipalign -v 4 release/app-release-unsigned.apk l2mmis.apk

