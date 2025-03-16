---
tags:
  - go
  - lsm
  - db
  - data structures
description: 'Learnings around designing my own SSTable format'
title: 'A Journey Of SSTables'
pubDate: '2025-03-16T14:18:56.229+13:00'
draft: true
---

A while ago I was creating a fixed size key-value ([fixedkv](https://github.com/JayJamieson/fixedkv)) store. At the time I was trying to learn more about how to write data in binary format as this was a new concept to me.

They way it works is simple, I have a in memory B-tree as my main key value store. It supports `Get` and `Set` operations. To persist to disk I call the `Close()` method, this traverses the B-tree in ascending order writing all the keys first with pointers to the actual key-value pairs. After the keys the key-value pairs are written in the same ascending order.

TODO: diagram of the result

I've since read through a few papers, codebases and the start of "Designing Data-Intensive Applications" on LSM based databases. I realised that my rudimentary file format had some similarities with SSTables and I'm not as dumb as I think I am 🙃.

The main difference between my format and SSTables is the key pointers (SSTable index) are written to the end of the file after all the key-value pairs. It's not clear to me why this is but I'm hazarding a guess it's an optimization and efficiency thing.

TODO: diagram showing basic SSTable format against mine.

## Refactoring

I'm going to take you on my journey of refactoring my rudimentry file format to something closer to an SSTable. I went through three refactoring cycles until I got something closer to what LSM databases use as an SSTable. My design is still rudimentry at best but it's at least better than where it started.

### Plain old sorted key-value pairs

The first change I started with was skipping the step of writing out the key pointers and just writing key-value pairs in sorted order. The file format is a fixed size 4KB anyway can be read into memory for bulk loading into our in memory B-tree.

TODO: diff here of changes, maybe a PR link?

TODO: maybe a benchmark to see if it's faster ?

TODO: Potential problems if I decide to add move away from fixed size format to a larger format containing millions of entries

- it's not practical to load the whole file into memory
- can't do point lookups without first loading into B-tree
- range queries or scans are not possible

### Adding an index

If I decide to get rid of the fixed size constrained and move onto fixed instead referring to immutable, it would be nice to not have to read the entire file into memory to perform queries.

In anycase I assumed that adding an index of key => key-value offset to such a small set of data is probably going to result in worse point lookups. Reading from an SSD is about 25 microseconds while RAM is about 100 nanoseconds. For now this is probably slower but this change isn't really a performance oriented change. I'm instead adding new functionality such as a `Range(prefix string, func(string key, value byte[]) error)` method for performing a range scan without loading the entire file into the B-tree.

The format is starting to look a lot like and SSTable now. We now write out the sorted key-value pairs while maintaining a key to key-value offset as our index. Once all key-value pairs are written out, I write out the index at the end of the file.

It looks something like this now:

```txt
<----------Header---------->
| version | #keys | unused | key-values | index                      | manifest      |
| 4B      | 2B    | 90B    | ...        | #keys * 2B + key length    | index_size 8B |
```

I've additionally added a manifest at the end to indicate how large the index is for how much of the file to read into memory.

There is probably still some improvement to be made on the format, I could move the header section to the end and call it a footer or get rid of the header section entirely.

TODO: range scan and index creation diff, maybe a PR link?

TODO: benchmark of before and after

### A sparse index

One last change I decided add I got hints on from other LSM databases is to create a sparse index. As the index gets large it also becomes less feasable to load the whole index into memory. I'm not 100% sure if this is what other LSM databases do but the sparse index is like an index for your index, call it a secondary index.

The idea is that we sample every nth key => key-value offset from our index and create a second index for loading into memory. For example, imagine you have a full index with 1,000,000 entries. Instead of loading all 1,000,000 into memory, if we sample every 128th key we only need to load 7,812 entries.

Lets say our sparse index points the location of "apple" to be between offset 128,000 and 128,128 in our full index. We only load the full index between this range and then perform a binary search for the key => key-value offset, now that we have the offset we can perform another disk lookup for the data itself.

TODO: diff here of changes, maybe a PR link?

TODO: benchmark of before and after

## Closing thoughts

TODO: finish this
