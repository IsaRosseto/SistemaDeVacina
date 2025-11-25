import { useState, useEffect } from 'react';
import { getPeople, createPerson, deletePerson, getCard, getVaccines, registerVaccination, deleteRecord } from './api';
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
        <div className="container">
            <header>
                <div className="brand">
                    <h1>BTVacina</h1>
                    <p>Gestão de Imunização Integrada</p>
                </div>
                <div className="header-actions">
                    <button className="btn-danger" onClick={handleDeleteAll} disabled={isLoading}>
                        Resetar Tudo
                    </button>
                    <button className="btn-outline" onClick={handleSetup} disabled={isLoading}>
                        {isLoading ? "Processando..." : "Gerar Dados"}
                    </button>
                </div>
            </header>

            {/* Card Novo Paciente */}
            <div className="card card-padding">
                <h3>Novo Cadastro</h3>
                <div className="form-inline">
                    <input 
                        placeholder="Nome completo do paciente" 
                        value={newName} 
                        onChange={e=>setNewName(e.target.value)}
                    />
                    <input 
                        placeholder="CPF (somente números)" 
                        value={newCpf} 
                        onChange={e=>setNewCpf(e.target.value)}
                    />
                    <button className="btn-primary" onClick={handleAddPerson}>
                        Cadastrar
                    </button>
                </div>
            </div>

            <div className="grid-layout">
                
                {/* Coluna Esquerda: Lista */}
                <div className="card people-column">
                    <div className="people-header">
                        Pacientes ({people.length})
                    </div>
                    
                    <ul className="person-list">
                        {people.length === 0 && (
                            <li style={{padding:20, color:'#9ca3af', textAlign:'center'}}>
                                Nenhum registro.
                            </li>
                        )}
                        {people.map(p => (
                            <li 
                                key={p.id} 
                                className={`person-item ${selectedPerson?.id === p.id ? 'active' : ''}`} 
                                onClick={() => handleSelectPerson(p)}
                            >
                                <div>
                                    <span className="person-name">{p.name}</span>
                                    <span className="person-cpf">{p.cpf}</span>
                                </div>
                                <button className="btn-icon" onClick={(e) => handleDeletePerson(e, p.id)}>
                                    🗑️
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Coluna Direita: Detalhes */}
                <div className="card card-padding" style={{minHeight: '400px'}}>
                    {selectedPerson ? (
                        <>
                            <div className="patient-header">
                                <h3>Carteira Digital</h3>
                                <div className="patient-info">
                                    <div className="name">{selectedPerson.name}</div>
                                    <div className="cpf">CPF: {selectedPerson.cpf}</div>
                                </div>
                            </div>

                            <div className="action-bar">
                                <label>Nova Aplicação:</label>
                                <select 
                                    style={{flex: 2}}
                                    onChange={e=>setSelectedVaccineId(e.target.value)} 
                                    value={selectedVaccineId}
                                >
                                    <option value="">Selecione o Imunizante...</option>
                                    {vaccines.map(v => (
                                        <option key={v.id} value={v.id}>
                                            {v.name} - {v.manufacturer}
                                        </option>
                                    ))}
                                </select>
                                <input 
                                    type="number" 
                                    min="1" max="5" 
                                    value={dose} 
                                    onChange={e=>setDose(e.target.value)} 
                                    style={{width: '80px'}} 
                                    placeholder="Dose"
                                />
                                <button className="btn-primary" onClick={handleVaccinate}>
                                    Registrar
                                </button>
                            </div>

                            <div className="table-container">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Vacina / Fabricante</th>
                                            <th>Dose</th>
                                            <th>Data Aplicação</th>
                                            <th style={{textAlign:'right'}}>Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {vaccinationCard.length === 0 && (
                                            <tr>
                                                <td colSpan="4" style={{textAlign:'center', padding:30, color:'#9ca3af'}}>
                                                    Nenhum registro de vacinação encontrado.
                                                </td>
                                            </tr>
                                        )}
                                        {vaccinationCard.map(r => (
                                            <tr key={r.id}>
                                                <td style={{fontWeight:500}}>
                                                    {r.vaccineName || vaccineMap[r.vaccineId]}
                                                </td>
                                                <td>
                                                    <span className="dose-badge">{r.dose}ª Dose</span>
                                                </td>
                                                <td style={{color:'#4b5563'}}>
                                                    {new Date(r.date).toLocaleDateString('pt-BR')}
                                                </td>
                                                <td style={{textAlign:'right'}}>
                                                    <button className="btn-icon" onClick={()=>handleDeleteRecord(r.id)}>
                                                        🗑️
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    ) : (
                        <div className="empty-state">
                            <div className="empty-icon">👈</div>
                            <p>Selecione um paciente na lista ao lado<br/>para visualizar o histórico.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default App;
