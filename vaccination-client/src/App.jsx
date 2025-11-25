import { useState, useEffect } from 'react';
import {
  getPeople,
  createPerson,
  deletePerson,
  getCard,
  getVaccines,
  registerVaccination,
  deleteRecord
} from './api';
import './App.css';

function App() {
  const [people, setPeople] = useState([]);
  const [vaccines, setVaccines] = useState([]);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [vaccinationCard, setVaccinationCard] = useState([]);
  const [vaccineMap, setVaccineMap] = useState({});

  // Inputs
  const [newName, setNewName] = useState('');
  const [newCpf, setNewCpf] = useState('');
  const [selectedVaccineId, setSelectedVaccineId] = useState('');
  const [dose, setDose] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => { loadData(); }, []);

  const sortCardByDate = (cardList) => {
    return cardList.sort((a, b) => new Date(a.date) - new Date(b.date));
  };

  const loadData = async () => {
    try {
      const [pRes, vRes] = await Promise.all([getPeople(), getVaccines()]);
      setPeople(pRes.data);
      setVaccines(vRes.data);
      const vMap = {};
      vRes.data.forEach(v => vMap[v.id] = v.name);
      setVaccineMap(vMap);
    } catch (e) { console.error("Erro API", e); }
  };

  const handleDeleteAll = async () => {
    const password = prompt("Digite a senha de administrador para apagar TUDO:");
    if (password !== "1234") {
      if (password !== null) alert("⛔ Senha incorreta!");
      return;
    }
    if (!confirm("TEM CERTEZA? Isso apagará todos os pacientes.")) return;

    setIsLoading(true);
    try {
      for (const p of people) {
        await deletePerson(p.id);
      }
      setSelectedPerson(null);
      setVaccinationCard([]);
      await loadData();
      alert("🗑️ Pacientes removidos. Vacinas padrão mantidas.");
    } catch (error) {
      alert("Erro: " + error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetup = async () => {
    if(!confirm("Gerar 10 pacientes fictícios?")) return;

    setIsLoading(true);

    try {
      const vRes = await getVaccines();
      const availableVaccines = vRes.data;

      if (availableVaccines.length === 0) {
        alert("Erro: Nenhuma vacina encontrada no banco.");
        return;
      }

      const names = [
        "Ana Silva", "Bruno Souza", "Carlos Oliveira", "Daniela Lima", "Eduardo Pereira",
        "Fernanda Costa", "Gabriel Santos", "Helena Almeida", "Igor Ferreira", "Julia Rodrigues"
      ];

      for (let i = 0; i < names.length; i++) {
        const name = names[i];
        const cpfGerado = Math.floor(Math.random() * 10000000000).toString();

        let personId;
        try {
          const res = await createPerson({ name, cpf: cpfGerado });
          personId = res.data.id;
        } catch (err) { continue; }

        const numShots = Math.floor(Math.random() * 4) + 1;
        let currentDate = new Date();
        currentDate.setMonth(currentDate.getMonth() - 24);

        for (let d = 1; d <= numShots; d++) {
          const randomVaccine = availableVaccines[Math.floor(Math.random() * availableVaccines.length)];
          currentDate.setMonth(currentDate.getMonth() + 2 + Math.floor(Math.random() * 3));

          await registerVaccination({
            personId: personId,
            vaccineId: randomVaccine.id,
            dose: d,
            applicationDate: currentDate.toISOString()
          });
        }
      }

      await loadData();
      alert("✅ Pacientes gerados!");

    } catch (error) {
      alert("Erro no setup: " + error);
    } finally {
      setIsLoading(false);
    }
  }

  // --- AÇÕES DO USUÁRIO ---
  const handleAddPerson = async () => {
    if (!newName || !newCpf) return;
    try {
      await createPerson({ name: newName, cpf: newCpf });
      setNewName(''); setNewCpf('');
      loadData();
    } catch (e) { alert("Erro ao cadastrar. CPF duplicado?"); }
  };

  const handleSelectPerson = async (p) => {
    setSelectedPerson(p);
    const res = await getCard(p.id);
    setVaccinationCard(sortCardByDate(res.data));
  };

  const handleVaccinate = async () => {
    if (!selectedPerson || !selectedVaccineId) return;
    try {
      await registerVaccination({
        personId: selectedPerson.id,
        vaccineId: parseInt(selectedVaccineId),
        dose: parseInt(dose),
        applicationDate: new Date().toISOString()
      });
      const res = await getCard(selectedPerson.id);
      setVaccinationCard(sortCardByDate(res.data));
    } catch (e) { alert("Erro ao vacinar."); }
  };

  const handleDeleteRecord = async (id) => {
    if(!confirm("Remover este registro?")) return;
    await deleteRecord(id);
    const res = await getCard(selectedPerson.id);
    setVaccinationCard(sortCardByDate(res.data));
  }

  const handleDeletePerson = async (e, id) => {
    e.stopPropagation();
    if(!confirm("Apagar paciente?")) return;
    await deletePerson(id);
    if(selectedPerson?.id === id) setSelectedPerson(null);
    loadData();
  }

  return (
    <>
      {/* Header institucional inspirado no BTG */}
      <header className="btg-header">
        <div className="btg-logo">
          <span className="round">BTV</span>
          <span className="btg-system">acina</span>
        </div>
        <nav>
          <a href="#">Pacientes</a>
          <a href="#">Vacinas</a>
          <a href="#">Relatórios</a>
        </nav>
        <div className="btg-actions">
          <button className="btg-btn">Novo Cadastro</button>
          <a href="#" className="btg-link">Ajuda</a>
        </div>
      </header>
      <div className="btg-bar"></div>

      <div className="container">
        {/* Título institucional do sistema permanece na tela */}
        <header style={{marginBottom: 0, boxShadow: "none", border: "none", background: "none", height: "auto", position: "static"}}>
          <div>
            <h1>BTVacina</h1>
            <p style={{color: '#6b7280', margin:0}}>Sistema Integrado de Controle Vacinal</p>
          </div>
          <div style={{display:'flex', gap: 10}}>
            <button className="btn-danger" onClick={handleDeleteAll} disabled={isLoading}>🗑️ Resetar Tudo</button>
            <button className="btn-outline" onClick={handleSetup} disabled={isLoading}>
              {isLoading ? "⏳ ..." : "⚙️ Gerar Pacientes"}
            </button>
          </div>
        </header>

        <div className="card" style={{ marginBottom: 30 }}>
          <h3 style={{marginTop:0}}>Novo Paciente</h3>
          <div className="form-inline">
            <input placeholder="Nome completo" value={newName} onChange={e=>setNewName(e.target.value)}/>
            <input placeholder="CPF" value={newCpf} onChange={e=>setNewCpf(e.target.value)}/>
            <button className="btn-primary" onClick={handleAddPerson}>Cadastrar</button>
          </div>
        </div>

        <div className="grid-layout">
          <div className="card" style={{padding:0, overflow:'hidden', display: 'flex', flexDirection: 'column', height: '600px'}}>
            <div style={{padding: '16px 20px', borderBottom: '1px solid #e5e7eb', background: '#f9fafb'}}>
              <h3 style={{margin:0, fontSize:16}}>Pacientes ({people.length})</h3>
            </div>
            <ul className="person-list" style={{flex: 1, overflowY: 'auto'}}>
              {people.length === 0 && <p style={{padding:20, color:'#9ca3af', textAlign:'center'}}>Nenhum paciente cadastrado.</p>}
              {people.map(p => (
                <li key={p.id} className={`person-item ${selectedPerson?.id === p.id ? 'active' : ''}`} onClick={() => handleSelectPerson(p)}>
                  <div>
                    <span className="person-name">{p.name}</span>
                    <span className="person-cpf">CPF: {p.cpf}</span>
                  </div>
                  <button className="btn-icon" onClick={(e) => handleDeletePerson(e, p.id)}>🗑️</button>
                </li>
              ))}
            </ul>
          </div>

          <div className="card" style={{height: 'fit-content'}}>
            {selectedPerson ? (
              <>
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20}}>
                  <h2 style={{margin:0}}>Carteira de Vacinação</h2>
                  <div style={{textAlign:'right'}}>
                    <div style={{fontWeight:'bold', fontSize:18}}>{selectedPerson.name}</div>
                    <div style={{color:'#6b7280', fontSize:14}}>CPF: {selectedPerson.cpf}</div>
                  </div>
                </div>

                <div className="action-bar">
                  <span style={{fontWeight:600, color:'#374151'}}>💉 Aplicar:</span>
                  <select style={{flex:1}} onChange={e=>setSelectedVaccineId(e.target.value)} value={selectedVaccineId}>
                    <option value="">Selecione a Vacina...</option>
                    {vaccines.map(v => <option key={v.id} value={v.id}>{v.name} ({v.manufacturer})</option>)}
                  </select>
                  <input type="number" min="1" max="5" value={dose} onChange={e=>setDose(e.target.value)} style={{width:60}} placeholder="Dose"/>
                  <button className="btn-primary" onClick={handleVaccinate}>Registrar</button>
                </div>

                <div className="table-container">
                  <table>
                    <thead>
                    <tr><th>Vacina</th><th>Dose</th><th>Data</th><th style={{textAlign:'right'}}>Ações</th></tr>
                    </thead>
                    <tbody>
                    {vaccinationCard.length === 0 && <tr><td colSpan="4" style={{textAlign:'center', padding:30, color:'#aaa'}}>Nenhuma vacina.</td></tr>}
                    {vaccinationCard.map(r => (
                      <tr key={r.id}>
                        <td style={{fontWeight:500}}>{r.vaccineName || vaccineMap[r.vaccineId]}</td>
                        <td><span style={{background: '#dbeafe', color:'#1e40af', padding:'2px 8px', borderRadius:12, fontSize:12, fontWeight:600}}>{r.dose}ª Dose</span></td>
                        <td style={{color:'#4b5563'}}>{new Date(r.date).toLocaleDateString()}</td>
                        <td style={{textAlign:'right'}}><button className="btn-icon" onClick={()=>handleDeleteRecord(r.id)}>🗑️</button></td>
                      </tr>
                    ))}
                    </tbody>
                  </table>
                </div>
              </>
            ) : (
              <div style={{display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:'100%', color:'#9ca3af', minHeight:'300px'}}>
                <div style={{fontSize:40, marginBottom:10}}>👈</div>
                <p>Selecione um paciente.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
