// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'standard_trading_rules.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$StandardTradingRules extends StandardTradingRules {
  @override
  final String name;
  @override
  final String version;
  @override
  final Date effectiveDate;
  @override
  final String sourceDocument;
  @override
  final StandardTradingRulesFixedRate fixedRate;
  @override
  final StandardTradingRuleAccount account;
  @override
  final String transactionFormula;
  @override
  final BuiltList<StandardTradingRuleInstrument> instruments;
  @override
  final StandardTradingRuleText disclaimer;
  @override
  final StandardTradingRuleText relationshipDisclosure;

  factory _$StandardTradingRules(
          [void Function(StandardTradingRulesBuilder)? updates]) =>
      (StandardTradingRulesBuilder()..update(updates))._build();

  _$StandardTradingRules._(
      {required this.name,
      required this.version,
      required this.effectiveDate,
      required this.sourceDocument,
      required this.fixedRate,
      required this.account,
      required this.transactionFormula,
      required this.instruments,
      required this.disclaimer,
      required this.relationshipDisclosure})
      : super._();
  @override
  StandardTradingRules rebuild(
          void Function(StandardTradingRulesBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  StandardTradingRulesBuilder toBuilder() =>
      StandardTradingRulesBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is StandardTradingRules &&
        name == other.name &&
        version == other.version &&
        effectiveDate == other.effectiveDate &&
        sourceDocument == other.sourceDocument &&
        fixedRate == other.fixedRate &&
        account == other.account &&
        transactionFormula == other.transactionFormula &&
        instruments == other.instruments &&
        disclaimer == other.disclaimer &&
        relationshipDisclosure == other.relationshipDisclosure;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, name.hashCode);
    _$hash = $jc(_$hash, version.hashCode);
    _$hash = $jc(_$hash, effectiveDate.hashCode);
    _$hash = $jc(_$hash, sourceDocument.hashCode);
    _$hash = $jc(_$hash, fixedRate.hashCode);
    _$hash = $jc(_$hash, account.hashCode);
    _$hash = $jc(_$hash, transactionFormula.hashCode);
    _$hash = $jc(_$hash, instruments.hashCode);
    _$hash = $jc(_$hash, disclaimer.hashCode);
    _$hash = $jc(_$hash, relationshipDisclosure.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'StandardTradingRules')
          ..add('name', name)
          ..add('version', version)
          ..add('effectiveDate', effectiveDate)
          ..add('sourceDocument', sourceDocument)
          ..add('fixedRate', fixedRate)
          ..add('account', account)
          ..add('transactionFormula', transactionFormula)
          ..add('instruments', instruments)
          ..add('disclaimer', disclaimer)
          ..add('relationshipDisclosure', relationshipDisclosure))
        .toString();
  }
}

class StandardTradingRulesBuilder
    implements Builder<StandardTradingRules, StandardTradingRulesBuilder> {
  _$StandardTradingRules? _$v;

  String? _name;
  String? get name => _$this._name;
  set name(String? name) => _$this._name = name;

  String? _version;
  String? get version => _$this._version;
  set version(String? version) => _$this._version = version;

  Date? _effectiveDate;
  Date? get effectiveDate => _$this._effectiveDate;
  set effectiveDate(Date? effectiveDate) =>
      _$this._effectiveDate = effectiveDate;

  String? _sourceDocument;
  String? get sourceDocument => _$this._sourceDocument;
  set sourceDocument(String? sourceDocument) =>
      _$this._sourceDocument = sourceDocument;

  StandardTradingRulesFixedRateBuilder? _fixedRate;
  StandardTradingRulesFixedRateBuilder get fixedRate =>
      _$this._fixedRate ??= StandardTradingRulesFixedRateBuilder();
  set fixedRate(StandardTradingRulesFixedRateBuilder? fixedRate) =>
      _$this._fixedRate = fixedRate;

  StandardTradingRuleAccountBuilder? _account;
  StandardTradingRuleAccountBuilder get account =>
      _$this._account ??= StandardTradingRuleAccountBuilder();
  set account(StandardTradingRuleAccountBuilder? account) =>
      _$this._account = account;

  String? _transactionFormula;
  String? get transactionFormula => _$this._transactionFormula;
  set transactionFormula(String? transactionFormula) =>
      _$this._transactionFormula = transactionFormula;

  ListBuilder<StandardTradingRuleInstrument>? _instruments;
  ListBuilder<StandardTradingRuleInstrument> get instruments =>
      _$this._instruments ??= ListBuilder<StandardTradingRuleInstrument>();
  set instruments(ListBuilder<StandardTradingRuleInstrument>? instruments) =>
      _$this._instruments = instruments;

  StandardTradingRuleTextBuilder? _disclaimer;
  StandardTradingRuleTextBuilder get disclaimer =>
      _$this._disclaimer ??= StandardTradingRuleTextBuilder();
  set disclaimer(StandardTradingRuleTextBuilder? disclaimer) =>
      _$this._disclaimer = disclaimer;

  StandardTradingRuleTextBuilder? _relationshipDisclosure;
  StandardTradingRuleTextBuilder get relationshipDisclosure =>
      _$this._relationshipDisclosure ??= StandardTradingRuleTextBuilder();
  set relationshipDisclosure(
          StandardTradingRuleTextBuilder? relationshipDisclosure) =>
      _$this._relationshipDisclosure = relationshipDisclosure;

  StandardTradingRulesBuilder() {
    StandardTradingRules._defaults(this);
  }

  StandardTradingRulesBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _name = $v.name;
      _version = $v.version;
      _effectiveDate = $v.effectiveDate;
      _sourceDocument = $v.sourceDocument;
      _fixedRate = $v.fixedRate.toBuilder();
      _account = $v.account.toBuilder();
      _transactionFormula = $v.transactionFormula;
      _instruments = $v.instruments.toBuilder();
      _disclaimer = $v.disclaimer.toBuilder();
      _relationshipDisclosure = $v.relationshipDisclosure.toBuilder();
      _$v = null;
    }
    return this;
  }

  @override
  void replace(StandardTradingRules other) {
    _$v = other as _$StandardTradingRules;
  }

  @override
  void update(void Function(StandardTradingRulesBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  StandardTradingRules build() => _build();

  _$StandardTradingRules _build() {
    _$StandardTradingRules _$result;
    try {
      _$result = _$v ??
          _$StandardTradingRules._(
            name: BuiltValueNullFieldError.checkNotNull(
                name, r'StandardTradingRules', 'name'),
            version: BuiltValueNullFieldError.checkNotNull(
                version, r'StandardTradingRules', 'version'),
            effectiveDate: BuiltValueNullFieldError.checkNotNull(
                effectiveDate, r'StandardTradingRules', 'effectiveDate'),
            sourceDocument: BuiltValueNullFieldError.checkNotNull(
                sourceDocument, r'StandardTradingRules', 'sourceDocument'),
            fixedRate: fixedRate.build(),
            account: account.build(),
            transactionFormula: BuiltValueNullFieldError.checkNotNull(
                transactionFormula,
                r'StandardTradingRules',
                'transactionFormula'),
            instruments: instruments.build(),
            disclaimer: disclaimer.build(),
            relationshipDisclosure: relationshipDisclosure.build(),
          );
    } catch (_) {
      late String _$failedField;
      try {
        _$failedField = 'fixedRate';
        fixedRate.build();
        _$failedField = 'account';
        account.build();

        _$failedField = 'instruments';
        instruments.build();
        _$failedField = 'disclaimer';
        disclaimer.build();
        _$failedField = 'relationshipDisclosure';
        relationshipDisclosure.build();
      } catch (e) {
        throw BuiltValueNestedFieldError(
            r'StandardTradingRules', _$failedField, e.toString());
      }
      rethrow;
    }
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
