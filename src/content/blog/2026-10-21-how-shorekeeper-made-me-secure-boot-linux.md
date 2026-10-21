---
title: How Shorekeeper Made Me Secure Boot Linux
date: 2026-10-21T13:10:00
draft: false
tags:
  - Linux
  - Wuthering Waves
  - Gaming
  - Windwos
  - Debloat
  - Dual Boot
  - Secure Boot
  - Limine
---

It has been a while, hasn't it ?

No, I totally did not forget that I have a blog to maintain. Look, I still have two half-written drafts rotting in my backlog, yet here I am starting a completely new one. I genuinely do not know whether I will post this first or finish the ones that have been sitting there for weeks.

A lot has changed lately. Not that I have become some messiah or anything too important to write, life just decided to throw everything at me one after another.

Before I get into the technical madness, let me give a quick life rundown. First, I wrapped up my diplomas, started my BS degree recently, and officially entered my 3rd year of college. Second, I became the GDG On Campus Organizer (GDG OC) for my college! ( Quite proud of that, XD. ) I really hope I can live up to the expectations of the people who trusted me with the role. There are a lot more smol potato stuffs that happened not worthy enough to mention so be happy with the big potato stuffs I said.

And third, as the title says... I finally got into dual booting.

Anyone who knows me knows I was strictly against this. In fact, the exact reason I hated the idea of dual booting is the exact reason this setup turned out to be so necessary. Before I yap about how the partitions and bootloaders work, we need to talk about _why_ I ended up here.

### The Confession ( And The "Chulkani" )

Right. For the last two months, I was back on Windows after a very long Linux streak. Why? Mainly because I randomly decided to play Valorant again. There was no deep reason just a sudden urge to see if I could actually click heads. I did improve a tiny, microscopic bit and understood the mechanics better, even though my actual game sense still sucks massively.

To play Valorant (and deal with its invasive kernel-level Vanguard anti-cheat), I had to install Windows. Honestly? It wasn't terrible. I ran some heavy debloating scripts, stripped out the garbage, set up WSL for my coding workflow, and things were surprisingly fine. ( I actually planned a whole separate blog on Windows debloating let's see if that draft ever sees the light of day. )

I was happy. Games worked. Code worked. Peace was achieved.

... And then my _chulkani_ ( That unstoppable itch in my head ) started rising again.

I was randomly scrolling through Pinterest and saw some insanely clean Linux rices. And brother, that was way too hard to resist. My brain immediately went : _“Yep. Time to wipe Windows and install Linux again.”_

So I did. I nuked everything, installed Linux, and went straight into ricing it. Now look, as an A1 gooner (not that being clean is any better, and yes, great look for the new GDG Organizer revealing that on a public blog), I obviously went full Wuthering Waves theme.

Come on, you have to taste a little bit of everything in life to know what suits you, and WuWa just happens to be one of them.

I found some peak, ultra-minimal, clean Wuthering Waves wallpapers ( [Link](https://drive.google.com/drive/folders/1GwBykGeMJ3pF_mcbdA9TX9RgzC_3dyzQ?usp=drive_link) ) and built a setup that looked ridiculously good.

![](/CleanWuWaLinuxSetup.jpeg)
_Tell me this doesn't look clean. Go ahead, lie to yourself._

It's not too flashy to call a full rice, but I like the aesthetics and other aspects that I would love to call it a clean setup something that would want to revisit all the time.

Games were running smoothly, the aesthetics were immaculate, and I was at peace.

Until my friend discovered that there is a community made Bloodbrone [port](https://github.com/Supermedo/bloodborne_pc) that too with Co Op support, how can I resist not playing it my friends.

Look, I wouldn't call myself a hardcore Souls player, I just play those games co-op with my friends to chill and have fun for an hour or two a day ( Yea I just wrote chill with my friends in souls like game, bold and brave :D ). Now, can I get modded co-op and Cheat Engine working on Linux through Wine and Proton ? Yes. In fact, I _have_ done it before. Getting Cheat Engine to hook into a Proton prefix is a massive achievement in itself, and I hold full bragging rights for pulling it off.

The problem ? I forgot to take notes on _how_ I did it, and the exact steps completely evaporated from my brain.

Suddenly, I was facing the prospect of spending three hours tweaking prefixes, DLL overrides, and memory hooks just to play a game with my friends for an hour or two. When you just want to hop on Discord and mess around with the boys, spending the whole time acting as a compatibility engineer kills the vibe.

![](/Meme1.png)

### The Math Behind The Truce: Dual Booting

That is when it clicked. Why am I constantly formatting my entire drive back and forth like a maniac when I can just dual boot ?

Well I never preferred dual boot because it always seemed that it would hamper the productivity and honestly I used to fear that I would mess up either of my installs, that time I was beginner and I feared playing around with operating systems a lot. But now it's a whole different story!

I looked at my 512 GB SSD (which actually gives you around 475 GB of usable space after formatting and system reservations). I did the math :

- **100 GB for CachyOS Linux :** Strictly for coding, development, and daily productivity. 100 GB is more than enough when you aren't hoarding massive game files on it.

- **375 GB for Windows :** Strictly an isolated gaming console. Since I only use it for games that refuse to cooperate on Linux ( Valorant, PUBG, modded co-op games or other story mode games ), 375 GB easily fits four or five massive 60+ GB games at a time.

More importantly, this acts as a mental switch. When I boot into CachyOS, my brain knows it is time to build projects, write code, and focus. When I boot into Windows, it is strictly entertainment mode. Best of both worlds, zero compromise.

### Phase 1 : Ventoy, Partitions, and Why CachyOS Again ?

Well now that I have established what and why now it's time to yap about how.

Even though my Linux partition is strictly for coding now, you might ask: _“Why CachyOS ? Why not just Ubuntu or Mint or Fedora ?”_ Because over the years, Arch has completely rewired my brain.

I know where things live in Arch, I love `pacman` and the AUR, and CachyOS is fast out of the box. I am too comfortable with it to use anything else.

I grabbed a USB drive with **Ventoy** loaded up ( If you still flash single ISOs with Rufus in 2026, please stop torturing yourself Ventoy lets you just drag and drop both the Windows and CachyOS ISOs onto one stick ).

![](/Ventoy.png)

Here is the golden rule of dual booting without losing your sanity : **Always install Windows first.** Windows is a greedy operating system that does not respect roommates. If you install it second, it has a nasty habit of overwriting your Linux bootloader.

1. I installed Windows first, ran my debloat scripts, installed my GPU/chipset drivers, and shrank the main partition down from inside Windows Disk Management to leave 100 GB of unallocated space at the end.

2. I rebooted into Ventoy and launched the CachyOS installer.

3. **The Boot Partition :** During manual partitioning in CachyOS, you have to set up an EFI System Partition (ESP) mounted at `/boot`.

For those who don't know how this works : when your motherboard turns on, it has no idea what Linux or Windows is. It looks for a small FAT32 partition containing `.efi` executable files.

Having a proper `/boot` partition ( at least 1 GB to 2 GB so kernel images don't choke it ) holds your Linux kernels and your bootloader, which then points the motherboard to either your Linux root partition or the Windows Boot Manager.

And for my bootloader, I didn't pick GRUB. I picked **Limine**.

### Phase 2 : The Boss Fight Limine, Secure Boot, & Shorekeeper

Why Limine ? Because it is modern, super clean, supports Btrfs snapshots out of the box, and most importantly : **you can easily rice it with custom wallpapers.**

Naturally, I immediately threw a gorgeous Wuthering Waves **Shorekeeper** wallpaper onto my Limine boot screen.

![](/ShorekeeperBootMenu.png)

And then came the real challenge : **Secure Boot.**

Remember Valorant and PUBG ? Their anti-cheats scream and refuse to launch if Secure Boot is disabled in your BIOS. Now what i can too is disable secure boot when I get into linux and if I want to get to windows I can get into windows, way too much work for my lazy brain.

But if you just turn Secure Boot on with a custom Linux kernel and Limine, your motherboard looks at Linux, says _"Who the hell are you?"_, and blocks the OS from booting.

To fix this, you have to become your own certificate authority using an amazing Arch tool called **`sbctl`**.

#### Step 1 : The MSI Thin 15 Hidden BIOS Boss

Before Linux can enroll custom Secure Boot keys, your BIOS needs to be in **"Setup Mode"** ( which clears out the locked factory state so it accepts your custom keys ).

Sounds simple, right ? Except I use an **MSI Thin 15**. And MSI, in their infinite wisdom, locks away the granular settings behind a secret developer BIOS menu. If you ever need to unlock the hidden Advanced BIOS on an MSI laptop, you have to boot into the BIOS and press a cheat code like you are unlocking Akuma in Street Fighter : **Hold `Left Alt` + `Right Ctrl` ( or `Fn + Copilot` on newer keyboards ) + `Right Shift` + press `F2`.**

I have the newer keyboard so I need to press that a\*\* button TT

![](/Meme2.png)

Once the secret menu unlocked, I went into the Secure Boot settings, switched it to **Custom Mode**, cleared/reset the factory keys to put the board into **Setup Mode**, and booted back into CachyOS.

#### Step 2 : Enrolling Keys with `sbctl`

Inside CachyOS, I followed the wiki docs and ran:

```plain
sudo pacman -S sbctl
sudo sbctl create-keys****sudo sbctl enroll-keys --microsoft

```

_( Note: That `--microsoft` flag is life-saving. Because we are dual-booting Windows, if you enroll ONLY your custom Linux keys without Microsoft's vendor keys, Windows and your GPU firmware will refuse to boot! )_

#### Step 3 : Why Shorekeeper Almost Brick-walled Me ( The BLAKE2b Hash )

Here is where Limine works differently from GRUB. With Secure Boot active, Limine doesn't just check if the bootloader binary ( `BOOTX64.EFI` ) is signed it strictly verifies the cryptographic checksum of its own configuration file ( `limine.conf` ) and **every single file referenced inside it**, including kernels and _boot wallpapers_.

If a file doesn't have a matching BLAKE2b hash attached to it in the config, Limine panics under Secure Boot because someone could theoretically swap a file on your unencrypted `/boot` partition.

First, you have to open `/etc/default/limine` and add : `ENABLE_ENROLL_LIMINE_CONFIG=yes`

That automates the kernel hashes during updates, **but pacman hooks do not automatically hash your custom anime wallpaper!** To get Shorekeeper past Secure Boot security, I had to manually generate a BLAKE2b checksum of the image in the terminal:

```plain
b2sum /boot/shorekeeper.png

```

That spits out a massive 128-character cryptographic string. Then, you open `/boot/limine.conf` and append that exact hash right after the image path using a `#` symbol:

```plain
wallpaper: boot():/shorekeeper.png#75205d08fa9c61599897857e...

```

After that, you lock it all in by running :

```plain
sudo limine-enroll-config
sudo limine-update

```

Rebooted into BIOS, turned Secure Boot back on, and boom Shorekeeper greeted me in full HD _with_ Secure Boot completely verified and Valorant ready to run on the other side. Honestly, peak engineering.

![](/SBCTLScreenshot.png)

### Phase 3 : Breaking The Berlin Wall Between Filesystems ( Btrfs ↔ NTFS )

The last annoyance of dual booting is when you are on Windows and realize a PDF or config file you need is sitting on your Linux drive or vice versa. Normally, Windows looks at a Linux partition and thinks it is corrupted alien space.

Since CachyOS uses **Btrfs** by default and Windows uses **NTFS**, I set up a two-way bridge so both OSes can read and write to each other seamlessly :

1. **Accessing Linux from Windows ( WinBtrfs ) :** Instead of suffering, I installed **WinBtrfs**, an open-source Windows driver written from scratch that teaches Windows how to natively read and write Btrfs partitions.

Since I am doing secure boot, I just needed to add a registry entry to prevent it from shouting that secure boot is on and preventing from accessing the other drives.

Once installed, my CachyOS partition literally just shows up inside Windows File Explorer like a normal `D:` or `E:` drive. It feels illegal seeing `/home` inside Windows Explorer, but it works flawlessly.

2. **Accessing Windows from CachyOS ( NTFS-3G / Kernel `ntfs3` ) :** Going the other way is even easier. Linux already understands NTFS via the `ntfs3` kernel driver (or `ntfs-3g`). The only trick here is that **you must disable "Fast Startup" inside Windows Power Options.**

If Fast Startup is on, Windows doesn't actually shut down it hibernates the kernel and puts a dirty lock on the NTFS drive, forcing Linux to mount it as Read-Only so it doesn't corrupt your files.

Once Fast Startup is dead, a simple mount rule in `/etc/fstab` makes my entire Windows drive accessible right inside CachyOS.

![](/WindowsXLinux.png)![](/LinuxXWindows.png)

### Wrapping It Up

And that is pretty much where my machine sits right now.

For someone who swore up and down that dual booting was a terrible idea, I actually couldn't be happier with this setup. When I want to lock in, build stuff, or handle GDG campus work or I need to study, I boot into CachyOS and live in my fast, distraction-free environment. When the boys ping on Discord for co-op games or Valorant, I reboot into Windows and jump straight in without debugging a single DLL override.

Plus, my bootloader has Shorekeeper on it, cryptographically signed and verified by my motherboard. What more could a man ask for ?

Now I just need to figure out if I am ever going to finish those other two pending blogs, or if I will find another excuse to break my computer first. ( My money is on the second one. )

Thanks for reading this far! Drop a comment or reach out if you're stuck fighting MSI's BIOS or Limine hashes, and have an awesome day ahead!
