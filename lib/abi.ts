export const monadTimeCapsuleAbi = [
  {
    type: 'constructor',
    inputs: []
  },
  {
    type: 'event',
    name: 'CapsuleCreated',
    inputs: [
      { indexed: true, name: 'id', type: 'uint256' },
      { indexed: true, name: 'author', type: 'address' },
      { indexed: false, name: 'unlockAt', type: 'uint256' },
      { indexed: false, name: 'amountPaid', type: 'uint256' }
    ],
    anonymous: false
  },
  {
    type: 'function',
    stateMutability: 'nonpayable',
    name: 'creationFee',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    type: 'function',
    stateMutability: 'payable',
    name: 'createCapsule',
    inputs: [
      { name: 'message', type: 'string' },
      { name: 'unlockAt', type: 'uint256' }
    ],
    outputs: []
  },
  {
    type: 'function',
    stateMutability: 'view',
    name: 'getCapsule',
    inputs: [{ name: 'id', type: 'uint256' }],
    outputs: [
      { name: 'author', type: 'address' },
      { name: 'message', type: 'string' },
      { name: 'createdAt', type: 'uint256' },
      { name: 'unlockAt', type: 'uint256' },
      { name: 'amountPaid', type: 'uint256' },
      { name: 'isUnlocked', type: 'bool' }
    ]
  },
  {
    type: 'function',
    stateMutability: 'view',
    name: 'getCapsuleCount',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    type: 'function',
    stateMutability: 'view',
    name: 'maxMessageLength',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    type: 'function',
    stateMutability: 'view',
    name: 'owner',
    inputs: [],
    outputs: [{ name: '', type: 'address' }]
  },
  {
    type: 'function',
    stateMutability: 'nonpayable',
    name: 'setCreationFee',
    inputs: [{ name: 'newFee', type: 'uint256' }],
    outputs: []
  },
  {
    type: 'function',
    stateMutability: 'nonpayable',
    name: 'transferOwnership',
    inputs: [{ name: 'newOwner', type: 'address' }],
    outputs: []
  },
  {
    type: 'function',
    stateMutability: 'nonpayable',
    name: 'withdraw',
    inputs: [],
    outputs: []
  }
] as const;
