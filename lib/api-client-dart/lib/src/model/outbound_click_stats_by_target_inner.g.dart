// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'outbound_click_stats_by_target_inner.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$OutboundClickStatsByTargetInner
    extends OutboundClickStatsByTargetInner {
  @override
  final String target;
  @override
  final int count;

  factory _$OutboundClickStatsByTargetInner(
          [void Function(OutboundClickStatsByTargetInnerBuilder)? updates]) =>
      (OutboundClickStatsByTargetInnerBuilder()..update(updates))._build();

  _$OutboundClickStatsByTargetInner._(
      {required this.target, required this.count})
      : super._();
  @override
  OutboundClickStatsByTargetInner rebuild(
          void Function(OutboundClickStatsByTargetInnerBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  OutboundClickStatsByTargetInnerBuilder toBuilder() =>
      OutboundClickStatsByTargetInnerBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is OutboundClickStatsByTargetInner &&
        target == other.target &&
        count == other.count;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, target.hashCode);
    _$hash = $jc(_$hash, count.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'OutboundClickStatsByTargetInner')
          ..add('target', target)
          ..add('count', count))
        .toString();
  }
}

class OutboundClickStatsByTargetInnerBuilder
    implements
        Builder<OutboundClickStatsByTargetInner,
            OutboundClickStatsByTargetInnerBuilder> {
  _$OutboundClickStatsByTargetInner? _$v;

  String? _target;
  String? get target => _$this._target;
  set target(String? target) => _$this._target = target;

  int? _count;
  int? get count => _$this._count;
  set count(int? count) => _$this._count = count;

  OutboundClickStatsByTargetInnerBuilder() {
    OutboundClickStatsByTargetInner._defaults(this);
  }

  OutboundClickStatsByTargetInnerBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _target = $v.target;
      _count = $v.count;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(OutboundClickStatsByTargetInner other) {
    _$v = other as _$OutboundClickStatsByTargetInner;
  }

  @override
  void update(void Function(OutboundClickStatsByTargetInnerBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  OutboundClickStatsByTargetInner build() => _build();

  _$OutboundClickStatsByTargetInner _build() {
    final _$result = _$v ??
        _$OutboundClickStatsByTargetInner._(
          target: BuiltValueNullFieldError.checkNotNull(
              target, r'OutboundClickStatsByTargetInner', 'target'),
          count: BuiltValueNullFieldError.checkNotNull(
              count, r'OutboundClickStatsByTargetInner', 'count'),
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
