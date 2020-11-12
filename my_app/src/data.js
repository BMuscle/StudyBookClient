// Emulating todo records which should be returned from API backend
// in the real world.
export default [
  {
    title: 'John Doe',
    description: "it's Mylist1",
    notes: [
      {
        id: 1,
        title: 'aaa',
        pivot: { id: 1 }
      },
      {
        id: 2,
        title: 'bbb',
        pivot: { id: 2 }
      }
    ]
  },
  {
    title: 'Mike',
    description: "it's Mylist2",
    notes: [
      {
        id: 3,
        title: 'ccc',
        pivot: { id: 3 }
      },
      {
        id: 4,
        title: 'ddd',
        pivot: { id: 4 }
      }
    ]
  }
]
