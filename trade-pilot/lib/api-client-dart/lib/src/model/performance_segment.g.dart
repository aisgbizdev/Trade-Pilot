// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'performance_segment.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$PerformanceSegment extends PerformanceSegment {
  @override
  final bool gated;
  @override
  final int need;
  @override
  final int have;
  @override
  final BuiltList<PerformanceBucket> buckets;

  factory _$PerformanceSegment(
          [void Function(PerformanceSegmentBuilder)? updates]) =>
      (PerformanceSegmentBuilder()..update(updates))._build();

  _$PerformanceSegment._(
      {required this.gated,
      required this.need,
      required this.have,
      required this.buckets})
      : super._();
  @override
  PerformanceSegment rebuild(
          void Function(PerformanceSegmentBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  PerformanceSegmentBuilder toBuilder() =>
      PerformanceSegmentBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is PerformanceSegment &&
        gated == other.gated &&
        need == other.need &&
        have == other.have &&
        buckets == other.buckets;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, gated.hashCode);
    _$hash = $jc(_$hash, need.hashCode);
    _$hash = $jc(_$hash, have.hashCode);
    _$hash = $jc(_$hash, buckets.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'PerformanceSegment')
          ..add('gated', gated)
          ..add('need', need)
          ..add('have', have)
          ..add('buckets', buckets))
        .toString();
  }
}

class PerformanceSegmentBuilder
    implements Builder<PerformanceSegment, PerformanceSegmentBuilder> {
  _$PerformanceSegment? _$v;

  bool? _gated;
  bool? get gated => _$this._gated;
  set gated(bool? gated) => _$this._gated = gated;

  int? _need;
  int? get need => _$this._need;
  set need(int? need) => _$this._need = need;

  int? _have;
  int? get have => _$this._have;
  set have(int? have) => _$this._have = have;

  ListBuilder<PerformanceBucket>? _buckets;
  ListBuilder<PerformanceBucket> get buckets =>
      _$this._buckets ??= ListBuilder<PerformanceBucket>();
  set buckets(ListBuilder<PerformanceBucket>? buckets) =>
      _$this._buckets = buckets;

  PerformanceSegmentBuilder() {
    PerformanceSegment._defaults(this);
  }

  PerformanceSegmentBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _gated = $v.gated;
      _need = $v.need;
      _have = $v.have;
      _buckets = $v.buckets.toBuilder();
      _$v = null;
    }
    return this;
  }

  @override
  void replace(PerformanceSegment other) {
    _$v = other as _$PerformanceSegment;
  }

  @override
  void update(void Function(PerformanceSegmentBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  PerformanceSegment build() => _build();

  _$PerformanceSegment _build() {
    _$PerformanceSegment _$result;
    try {
      _$result = _$v ??
          _$PerformanceSegment._(
            gated: BuiltValueNullFieldError.checkNotNull(
                gated, r'PerformanceSegment', 'gated'),
            need: BuiltValueNullFieldError.checkNotNull(
                need, r'PerformanceSegment', 'need'),
            have: BuiltValueNullFieldError.checkNotNull(
                have, r'PerformanceSegment', 'have'),
            buckets: buckets.build(),
          );
    } catch (_) {
      late String _$failedField;
      try {
        _$failedField = 'buckets';
        buckets.build();
      } catch (e) {
        throw BuiltValueNestedFieldError(
            r'PerformanceSegment', _$failedField, e.toString());
      }
      rethrow;
    }
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
