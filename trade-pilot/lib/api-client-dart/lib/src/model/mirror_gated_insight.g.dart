// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'mirror_gated_insight.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

const MirrorGatedInsightReasonEnum _$mirrorGatedInsightReasonEnum_needMoreData =
    const MirrorGatedInsightReasonEnum._('needMoreData');

MirrorGatedInsightReasonEnum _$mirrorGatedInsightReasonEnumValueOf(
    String name) {
  switch (name) {
    case 'needMoreData':
      return _$mirrorGatedInsightReasonEnum_needMoreData;
    default:
      throw ArgumentError(name);
  }
}

final BuiltSet<MirrorGatedInsightReasonEnum>
    _$mirrorGatedInsightReasonEnumValues =
    BuiltSet<MirrorGatedInsightReasonEnum>(const <MirrorGatedInsightReasonEnum>[
  _$mirrorGatedInsightReasonEnum_needMoreData,
]);

Serializer<MirrorGatedInsightReasonEnum>
    _$mirrorGatedInsightReasonEnumSerializer =
    _$MirrorGatedInsightReasonEnumSerializer();

class _$MirrorGatedInsightReasonEnumSerializer
    implements PrimitiveSerializer<MirrorGatedInsightReasonEnum> {
  static const Map<String, Object> _toWire = const <String, Object>{
    'needMoreData': 'need_more_data',
  };
  static const Map<Object, String> _fromWire = const <Object, String>{
    'need_more_data': 'needMoreData',
  };

  @override
  final Iterable<Type> types = const <Type>[MirrorGatedInsightReasonEnum];
  @override
  final String wireName = 'MirrorGatedInsightReasonEnum';

  @override
  Object serialize(Serializers serializers, MirrorGatedInsightReasonEnum object,
          {FullType specifiedType = FullType.unspecified}) =>
      _toWire[object.name] ?? object.name;

  @override
  MirrorGatedInsightReasonEnum deserialize(
          Serializers serializers, Object serialized,
          {FullType specifiedType = FullType.unspecified}) =>
      MirrorGatedInsightReasonEnum.valueOf(
          _fromWire[serialized] ?? (serialized is String ? serialized : ''));
}

class _$MirrorGatedInsight extends MirrorGatedInsight {
  @override
  final bool gated;
  @override
  final MirrorGatedInsightReasonEnum? reason;
  @override
  final int? need;
  @override
  final int? have;
  @override
  final BuiltMap<String, JsonObject?>? data;

  factory _$MirrorGatedInsight(
          [void Function(MirrorGatedInsightBuilder)? updates]) =>
      (MirrorGatedInsightBuilder()..update(updates))._build();

  _$MirrorGatedInsight._(
      {required this.gated, this.reason, this.need, this.have, this.data})
      : super._();
  @override
  MirrorGatedInsight rebuild(
          void Function(MirrorGatedInsightBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  MirrorGatedInsightBuilder toBuilder() =>
      MirrorGatedInsightBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is MirrorGatedInsight &&
        gated == other.gated &&
        reason == other.reason &&
        need == other.need &&
        have == other.have &&
        data == other.data;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, gated.hashCode);
    _$hash = $jc(_$hash, reason.hashCode);
    _$hash = $jc(_$hash, need.hashCode);
    _$hash = $jc(_$hash, have.hashCode);
    _$hash = $jc(_$hash, data.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'MirrorGatedInsight')
          ..add('gated', gated)
          ..add('reason', reason)
          ..add('need', need)
          ..add('have', have)
          ..add('data', data))
        .toString();
  }
}

class MirrorGatedInsightBuilder
    implements Builder<MirrorGatedInsight, MirrorGatedInsightBuilder> {
  _$MirrorGatedInsight? _$v;

  bool? _gated;
  bool? get gated => _$this._gated;
  set gated(bool? gated) => _$this._gated = gated;

  MirrorGatedInsightReasonEnum? _reason;
  MirrorGatedInsightReasonEnum? get reason => _$this._reason;
  set reason(MirrorGatedInsightReasonEnum? reason) => _$this._reason = reason;

  int? _need;
  int? get need => _$this._need;
  set need(int? need) => _$this._need = need;

  int? _have;
  int? get have => _$this._have;
  set have(int? have) => _$this._have = have;

  MapBuilder<String, JsonObject?>? _data;
  MapBuilder<String, JsonObject?> get data =>
      _$this._data ??= MapBuilder<String, JsonObject?>();
  set data(MapBuilder<String, JsonObject?>? data) => _$this._data = data;

  MirrorGatedInsightBuilder() {
    MirrorGatedInsight._defaults(this);
  }

  MirrorGatedInsightBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _gated = $v.gated;
      _reason = $v.reason;
      _need = $v.need;
      _have = $v.have;
      _data = $v.data?.toBuilder();
      _$v = null;
    }
    return this;
  }

  @override
  void replace(MirrorGatedInsight other) {
    _$v = other as _$MirrorGatedInsight;
  }

  @override
  void update(void Function(MirrorGatedInsightBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  MirrorGatedInsight build() => _build();

  _$MirrorGatedInsight _build() {
    _$MirrorGatedInsight _$result;
    try {
      _$result = _$v ??
          _$MirrorGatedInsight._(
            gated: BuiltValueNullFieldError.checkNotNull(
                gated, r'MirrorGatedInsight', 'gated'),
            reason: reason,
            need: need,
            have: have,
            data: _data?.build(),
          );
    } catch (_) {
      late String _$failedField;
      try {
        _$failedField = 'data';
        _data?.build();
      } catch (e) {
        throw BuiltValueNestedFieldError(
            r'MirrorGatedInsight', _$failedField, e.toString());
      }
      rethrow;
    }
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
