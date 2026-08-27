// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'fundamental_drift_citation.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

const FundamentalDriftCitationKindEnum _$fundamentalDriftCitationKindEnum_news =
    const FundamentalDriftCitationKindEnum._('news');
const FundamentalDriftCitationKindEnum
    _$fundamentalDriftCitationKindEnum_calendar =
    const FundamentalDriftCitationKindEnum._('calendar');

FundamentalDriftCitationKindEnum _$fundamentalDriftCitationKindEnumValueOf(
    String name) {
  switch (name) {
    case 'news':
      return _$fundamentalDriftCitationKindEnum_news;
    case 'calendar':
      return _$fundamentalDriftCitationKindEnum_calendar;
    default:
      throw ArgumentError(name);
  }
}

final BuiltSet<FundamentalDriftCitationKindEnum>
    _$fundamentalDriftCitationKindEnumValues = BuiltSet<
        FundamentalDriftCitationKindEnum>(const <FundamentalDriftCitationKindEnum>[
  _$fundamentalDriftCitationKindEnum_news,
  _$fundamentalDriftCitationKindEnum_calendar,
]);

Serializer<FundamentalDriftCitationKindEnum>
    _$fundamentalDriftCitationKindEnumSerializer =
    _$FundamentalDriftCitationKindEnumSerializer();

class _$FundamentalDriftCitationKindEnumSerializer
    implements PrimitiveSerializer<FundamentalDriftCitationKindEnum> {
  static const Map<String, Object> _toWire = const <String, Object>{
    'news': 'news',
    'calendar': 'calendar',
  };
  static const Map<Object, String> _fromWire = const <Object, String>{
    'news': 'news',
    'calendar': 'calendar',
  };

  @override
  final Iterable<Type> types = const <Type>[FundamentalDriftCitationKindEnum];
  @override
  final String wireName = 'FundamentalDriftCitationKindEnum';

  @override
  Object serialize(
          Serializers serializers, FundamentalDriftCitationKindEnum object,
          {FullType specifiedType = FullType.unspecified}) =>
      _toWire[object.name] ?? object.name;

  @override
  FundamentalDriftCitationKindEnum deserialize(
          Serializers serializers, Object serialized,
          {FullType specifiedType = FullType.unspecified}) =>
      FundamentalDriftCitationKindEnum.valueOf(
          _fromWire[serialized] ?? (serialized is String ? serialized : ''));
}

class _$FundamentalDriftCitation extends FundamentalDriftCitation {
  @override
  final FundamentalDriftCitationKindEnum kind;
  @override
  final String label;

  factory _$FundamentalDriftCitation(
          [void Function(FundamentalDriftCitationBuilder)? updates]) =>
      (FundamentalDriftCitationBuilder()..update(updates))._build();

  _$FundamentalDriftCitation._({required this.kind, required this.label})
      : super._();
  @override
  FundamentalDriftCitation rebuild(
          void Function(FundamentalDriftCitationBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  FundamentalDriftCitationBuilder toBuilder() =>
      FundamentalDriftCitationBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is FundamentalDriftCitation &&
        kind == other.kind &&
        label == other.label;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, kind.hashCode);
    _$hash = $jc(_$hash, label.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'FundamentalDriftCitation')
          ..add('kind', kind)
          ..add('label', label))
        .toString();
  }
}

class FundamentalDriftCitationBuilder
    implements
        Builder<FundamentalDriftCitation, FundamentalDriftCitationBuilder> {
  _$FundamentalDriftCitation? _$v;

  FundamentalDriftCitationKindEnum? _kind;
  FundamentalDriftCitationKindEnum? get kind => _$this._kind;
  set kind(FundamentalDriftCitationKindEnum? kind) => _$this._kind = kind;

  String? _label;
  String? get label => _$this._label;
  set label(String? label) => _$this._label = label;

  FundamentalDriftCitationBuilder() {
    FundamentalDriftCitation._defaults(this);
  }

  FundamentalDriftCitationBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _kind = $v.kind;
      _label = $v.label;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(FundamentalDriftCitation other) {
    _$v = other as _$FundamentalDriftCitation;
  }

  @override
  void update(void Function(FundamentalDriftCitationBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  FundamentalDriftCitation build() => _build();

  _$FundamentalDriftCitation _build() {
    final _$result = _$v ??
        _$FundamentalDriftCitation._(
          kind: BuiltValueNullFieldError.checkNotNull(
              kind, r'FundamentalDriftCitation', 'kind'),
          label: BuiltValueNullFieldError.checkNotNull(
              label, r'FundamentalDriftCitation', 'label'),
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
