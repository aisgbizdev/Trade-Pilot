// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'daily_summary_today.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

const DailySummaryTodayKindEnum _$dailySummaryTodayKindEnum_full =
    const DailySummaryTodayKindEnum._('full');
const DailySummaryTodayKindEnum _$dailySummaryTodayKindEnum_quotaOnly =
    const DailySummaryTodayKindEnum._('quotaOnly');

DailySummaryTodayKindEnum _$dailySummaryTodayKindEnumValueOf(String name) {
  switch (name) {
    case 'full':
      return _$dailySummaryTodayKindEnum_full;
    case 'quotaOnly':
      return _$dailySummaryTodayKindEnum_quotaOnly;
    default:
      throw ArgumentError(name);
  }
}

final BuiltSet<DailySummaryTodayKindEnum> _$dailySummaryTodayKindEnumValues =
    BuiltSet<DailySummaryTodayKindEnum>(const <DailySummaryTodayKindEnum>[
  _$dailySummaryTodayKindEnum_full,
  _$dailySummaryTodayKindEnum_quotaOnly,
]);

Serializer<DailySummaryTodayKindEnum> _$dailySummaryTodayKindEnumSerializer =
    _$DailySummaryTodayKindEnumSerializer();

class _$DailySummaryTodayKindEnumSerializer
    implements PrimitiveSerializer<DailySummaryTodayKindEnum> {
  static const Map<String, Object> _toWire = const <String, Object>{
    'full': 'full',
    'quotaOnly': 'quota_only',
  };
  static const Map<Object, String> _fromWire = const <Object, String>{
    'full': 'full',
    'quota_only': 'quotaOnly',
  };

  @override
  final Iterable<Type> types = const <Type>[DailySummaryTodayKindEnum];
  @override
  final String wireName = 'DailySummaryTodayKindEnum';

  @override
  Object serialize(Serializers serializers, DailySummaryTodayKindEnum object,
          {FullType specifiedType = FullType.unspecified}) =>
      _toWire[object.name] ?? object.name;

  @override
  DailySummaryTodayKindEnum deserialize(
          Serializers serializers, Object serialized,
          {FullType specifiedType = FullType.unspecified}) =>
      DailySummaryTodayKindEnum.valueOf(
          _fromWire[serialized] ?? (serialized is String ? serialized : ''));
}

class _$DailySummaryToday extends DailySummaryToday {
  @override
  final String digestDate;
  @override
  final DailySummaryTodayKindEnum kind;
  @override
  final BuiltList<String> instruments;
  @override
  final String summary;
  @override
  final DateTime createdAt;
  @override
  final BuiltList<DailySummaryAnalysis> analyses;

  factory _$DailySummaryToday(
          [void Function(DailySummaryTodayBuilder)? updates]) =>
      (DailySummaryTodayBuilder()..update(updates))._build();

  _$DailySummaryToday._(
      {required this.digestDate,
      required this.kind,
      required this.instruments,
      required this.summary,
      required this.createdAt,
      required this.analyses})
      : super._();
  @override
  DailySummaryToday rebuild(void Function(DailySummaryTodayBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  DailySummaryTodayBuilder toBuilder() =>
      DailySummaryTodayBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is DailySummaryToday &&
        digestDate == other.digestDate &&
        kind == other.kind &&
        instruments == other.instruments &&
        summary == other.summary &&
        createdAt == other.createdAt &&
        analyses == other.analyses;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, digestDate.hashCode);
    _$hash = $jc(_$hash, kind.hashCode);
    _$hash = $jc(_$hash, instruments.hashCode);
    _$hash = $jc(_$hash, summary.hashCode);
    _$hash = $jc(_$hash, createdAt.hashCode);
    _$hash = $jc(_$hash, analyses.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'DailySummaryToday')
          ..add('digestDate', digestDate)
          ..add('kind', kind)
          ..add('instruments', instruments)
          ..add('summary', summary)
          ..add('createdAt', createdAt)
          ..add('analyses', analyses))
        .toString();
  }
}

class DailySummaryTodayBuilder
    implements Builder<DailySummaryToday, DailySummaryTodayBuilder> {
  _$DailySummaryToday? _$v;

  String? _digestDate;
  String? get digestDate => _$this._digestDate;
  set digestDate(String? digestDate) => _$this._digestDate = digestDate;

  DailySummaryTodayKindEnum? _kind;
  DailySummaryTodayKindEnum? get kind => _$this._kind;
  set kind(DailySummaryTodayKindEnum? kind) => _$this._kind = kind;

  ListBuilder<String>? _instruments;
  ListBuilder<String> get instruments =>
      _$this._instruments ??= ListBuilder<String>();
  set instruments(ListBuilder<String>? instruments) =>
      _$this._instruments = instruments;

  String? _summary;
  String? get summary => _$this._summary;
  set summary(String? summary) => _$this._summary = summary;

  DateTime? _createdAt;
  DateTime? get createdAt => _$this._createdAt;
  set createdAt(DateTime? createdAt) => _$this._createdAt = createdAt;

  ListBuilder<DailySummaryAnalysis>? _analyses;
  ListBuilder<DailySummaryAnalysis> get analyses =>
      _$this._analyses ??= ListBuilder<DailySummaryAnalysis>();
  set analyses(ListBuilder<DailySummaryAnalysis>? analyses) =>
      _$this._analyses = analyses;

  DailySummaryTodayBuilder() {
    DailySummaryToday._defaults(this);
  }

  DailySummaryTodayBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _digestDate = $v.digestDate;
      _kind = $v.kind;
      _instruments = $v.instruments.toBuilder();
      _summary = $v.summary;
      _createdAt = $v.createdAt;
      _analyses = $v.analyses.toBuilder();
      _$v = null;
    }
    return this;
  }

  @override
  void replace(DailySummaryToday other) {
    _$v = other as _$DailySummaryToday;
  }

  @override
  void update(void Function(DailySummaryTodayBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  DailySummaryToday build() => _build();

  _$DailySummaryToday _build() {
    _$DailySummaryToday _$result;
    try {
      _$result = _$v ??
          _$DailySummaryToday._(
            digestDate: BuiltValueNullFieldError.checkNotNull(
                digestDate, r'DailySummaryToday', 'digestDate'),
            kind: BuiltValueNullFieldError.checkNotNull(
                kind, r'DailySummaryToday', 'kind'),
            instruments: instruments.build(),
            summary: BuiltValueNullFieldError.checkNotNull(
                summary, r'DailySummaryToday', 'summary'),
            createdAt: BuiltValueNullFieldError.checkNotNull(
                createdAt, r'DailySummaryToday', 'createdAt'),
            analyses: analyses.build(),
          );
    } catch (_) {
      late String _$failedField;
      try {
        _$failedField = 'instruments';
        instruments.build();

        _$failedField = 'analyses';
        analyses.build();
      } catch (e) {
        throw BuiltValueNestedFieldError(
            r'DailySummaryToday', _$failedField, e.toString());
      }
      rethrow;
    }
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
