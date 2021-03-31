# Ksm_rmrk
Rmrk scan for Kusama Blockchain


### For scan a Blockchain :

#### Accepted blockchains :
* Kusama
* Polkadot
* Westend

<pre><code>
yarn fetch --chain=chainName --block=blockNumber
</code></pre>

### For scan only one block :

<pre><code>
yarn scan --chain=chainName --block=blockNumber
</code></pre>


If you stop fetch with user exit (Ctrl + C), you can restart the scan without specify a block number :

<pre><code>
yarn fetch --chain=same_chainName
</code></pre>


Each run write or rewrite a file for lock the thread on the root (thread.lock.json), if you want to start a new scan without manually delete, the console will ask you if you want to delete it automatically.
The script need this file deleted to run.
