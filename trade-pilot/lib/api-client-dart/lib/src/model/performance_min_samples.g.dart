// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'performance_min_samples.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$PerformanceMinSamples extends PerformanceMinSamples {
  @override
  final int bucket;
  @override
  final int overall;
  @override
  final int banner;

  factory _$PerformanceMinSamples(
          [void Function(PerformanceMinSamplesBuilder)? updates]) =>
      (PerformanceMinSamplesBuilder()..update(updates))._build();

  _$PerformanceMinSamples._(
      {required this.bucket, required this.overall, required this.banner})
      : super._();
  @override
  PerformanceMinSamples rebuild(
          void Function(PerformanceMinSamplesBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  PerformanceMinSamplesBuilder toBuilder() =>
      PerformanceMinSamplesBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is PerformanceMinSamples &&
        bucket == other.bucket &&
        overall == other.overall &&
        banner == other.banner;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, bucket.hashCode);
    _$hash = $jc(_$hash, overall.hashCode);
    _$hash = $jc(_$hash, banner.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'PerformanceMinSamples')
          ..add('bucket', bucket)
          ..add('overall', overall)
          ..add('banner', banner))
        .toString();
  }
}

class PerformanceMinSamplesBuilder
    implements Builder<PerformanceMinSamples, PerformanceMinSamplesBuilder> {
  _$PerformanceMinSamples? _$v;

  int? _bucket;
  int? get bucket => _$this._bucket;
  set bucket(int? bucket) => _$this._bucket = bucket;

  int? _overall;
  int? get overall => _$this._overall;
  set overall(int? overall) => _$this._overall = overall;

  int? _banner;
  int? get banner => _$this._banner;
  set banner(int? banner) => _$this._banner = banner;

  PerformanceMinSamplesBuilder() {
    PerformanceMinSamples._defaults(this);
  }

  PerformanceMinSamplesBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _bucket = $v.bucket;
      _overall = $v.overall;
      _banner = $v.banner;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(PerformanceMinSamples other) {
    _$v = other as _$PerformanceMinSamples;
  }

  @override
  void update(void Function(PerformanceMinSamplesBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  PerformanceMinSamples build() => _build();

  _$PerformanceMinSamples _build() {
    final _$result = _$v ??
        _$PerformanceMinSamples._(
          bucket: BuiltValueNullFieldError.checkNotNull(
              bucket, r'PerformanceMinSamples', 'bucket'),
          overall: BuiltValueNullFieldError.checkNotNull(
              overall, r'PerformanceMinSamples', 'overall'),
          banner: BuiltValueNullFieldError.checkNotNull(
              banner, r'PerformanceMinSamples', 'banner'),
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
