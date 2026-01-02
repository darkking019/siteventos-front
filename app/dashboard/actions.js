async function handleDelete(eventId) {
  if (!confirm('Tem certeza que deseja excluir este evento?')) return

  try {
    await api.delete(`/events/${eventId}`)
    
    // remove da tela sem reload
    setEvents(events => events.filter(e => e.id !== eventId))
  } catch (err) {
    alert('Erro ao excluir evento')
    console.error(err)
  }
}

async function handleLeave(eventId) {
  try {
    await api.delete(`/events/${eventId}/leave`)

    setEvents(events => events.filter(e => e.id !== eventId))
  } catch (err) {
    alert('Erro ao sair do evento')
    console.error(err)
  }
}
