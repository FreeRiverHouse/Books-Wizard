def inverte_stringa(s):
    """
    Inverte una stringa.
    
    Args:
        s (str): La stringa da invertire
        
    Returns:
        str: La stringa invertita
    """
    return s[::-1]


# Esempi di utilizzo
if __name__ == "__main__":
    # Test 1
    testo = "ciao"
    print(f"Originale: {testo}")
    print(f"Invertita: {inverte_stringa(testo)}")
    
    # Test 2
    testo2 = "Python"
    print(f"\nOriginale: {testo2}")
    print(f"Invertita: {inverte_stringa(testo2)}")
    
    # Test 3 - stringa vuota
    testo3 = ""
    print(f"\nOriginale: '{testo3}'")
    print(f"Invertita: '{inverte_stringa(testo3)}'")
